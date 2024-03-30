const express = require('express');
const cors = require('cors');
const reveal = require('reveal-sdk-node');
const fs = require("fs");
const path = require("path");
const { RdashDocument } = require('@revealbi/dom');

const app = express();
const dashboardDirectory = "dashboards";

app.use(cors()); // DEVELOPMENT only! In production, configure appropriately.

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
		const allVisualizationChartInfos = [];
		const dashboardFiles = fs.readdirSync('dashboards').filter(file => file.endsWith('.rdash'));

		for (const fileName of dashboardFiles) {
			const filePath = path.join('dashboards', fileName);
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
				};
				allVisualizationChartInfos.push(chartInfo);
			});
		}
		resp.status(200).json(allVisualizationChartInfos);
	} catch (ex) {
		resp.status(500).send(`An error occurred: ${ex.message}`);
	}
});


const options = {
}
app.use("/", reveal(options));

app.listen(7218, () => {
	console.log(`Reveal server accepting http requests`);
});