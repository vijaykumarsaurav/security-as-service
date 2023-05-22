import React from 'react';
import { Button } from '@carbon/react';
import { CSVDownload } from "react-csv";
import { Download } from '@carbon/react/icons';

const DownloadButton = ({downloadReportFlag, setDownloadReportFlag, data}) => {

    const downloadReport = () => {
        console.log("downloadReport", data)
        setDownloadReportFlag(true)
        window.location.reload()
    }

    return (

        <Button
            onClick={() => downloadReport()}
            size="small"
            kind="primary"
            renderIcon={Download}
        >
            Download
            {downloadReportFlag ? <CSVDownload enclosingCharacter={`"`} separator={','} filename='Report.csv' data={data} target="_blank" /> : ""}

        </Button>

    )

}


export default DownloadButton