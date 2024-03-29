import express, { Application } from 'express';
import reveal, { RevealOptions } from 'reveal-sdk-node';
import cors from "cors";
import fs from "fs";
import { RdashDocument } from '@revealbi/dom';
import path from 'path';

const app: Application = express();
const dashboardDirectory: string = "dashboards";

app.use(cors());

app.use("/images", express.static("images"));

app.get("/dashboards/:name/exists", (req, resp) => {
	if (fs.existsSync(`${dashboardDirectory}/${req.params.name}.rdash`)) {
		resp.send(true);
	}
	else {
		resp.send(false);
	}
});

app.get("/dashboards/visualizations", async (req, resp) => {
	try {
		const allVisualizationChartInfos: any[] = [];
		const dashboardFiles = fs.readdirSync(dashboardDirectory).filter(file => file.endsWith('.rdash'));

		for (const fileName of dashboardFiles) {
			const filePath = path.join(dashboardDirectory, fileName);
			const fileData = fs.readFileSync(filePath);
			const blob = new Blob([fileData], { type: 'application/zip' });
			const document = await RdashDocument.load(blob);

			document.visualizations.forEach(viz => {
				const chartInfo = {
					dashboardFileName: path.basename(filePath, '.rdash'),
					dashboardTitle: document.title,
					vizId: viz.id,
					vizTitle: viz.title,
					vizChartType: viz.chartType,
					vizImageUrl: getImageUrl(viz.chartType),
				};
				allVisualizationChartInfos.push(chartInfo);
			});
		}
		resp.status(200).json(allVisualizationChartInfos);
	} catch (ex: any) {
		resp.status(500).send(`An error occurred: ${ex.message}`);
	}
});


function getImageUrl(input: string) {
	return `${input.toLocaleLowerCase()}.png`;
}

const options: RevealOptions = {
}

app.use("/", reveal(options));

app.listen(7218, () => {
	console.log(`Reveal server accepting http requests`);
});