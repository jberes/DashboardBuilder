import { CSSProperties, useEffect, useMemo, useRef } from "react";

declare var $: any;

export interface ThumbnailProps {
    info: any;
    style?: CSSProperties;
}

export default function Thumbnail(props: ThumbnailProps) {
    const { info, style } = props;
    const defaultStyle: CSSProperties = { height: '100%', width: '100', position: 'relative'};
    const combinedStyle: CSSProperties = { ...defaultStyle, ...style }; // Merge with user-provided styles
    const uniqueId = useMemo(() => `rvThumb-${Math.random().toString(36).substr(2, 9)}`, []);  
    const dvRef = useRef<any>(null);


    useEffect(() => {
        if (!dvRef.current) {
            dvRef.current = new $.ig.RevealDashboardThumbnailView(`#${uniqueId}`);   
            dvRef.current.dashboardInfo = info;    
        }

        return () => {
            dvRef.current = null;
        }    
    }, [info, uniqueId]);

    return (
        <div id={uniqueId} style={combinedStyle}></div>
    );
}