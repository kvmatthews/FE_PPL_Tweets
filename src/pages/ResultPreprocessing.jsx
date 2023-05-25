import React, { useState } from "react";

const ResultPreprocessing = ({ dataResult, processing }) => {
  const totalData = dataResult.length;

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, dataResult.length);

  return (
    <>
      <div>
        <div class="title_page">
          <h1>Result Pre-Processing</h1>
        </div>
        <div class="page_explain">
          <p>
            This is the display of pre-processing results, in this menu the
            table will showcase the process of raw data that has previously been
            entered through the data collection menu. The data is then cleaned,
            formatted, and effectively processed to handle text data for
            sentiment analysis applications. In the table below, you can see the
            comparison between the original tweets or raw data and the data that
            has been pre-processed.
          </p>
        </div>
        <button class="pages_inputcsv" onClick={() => processing()}>
          Processing
        </button>
      </div>
      <div class="csv_table">
        <span>Total data: {totalData}</span>
        <table>
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Data Tweets Original</th>
              <th scope="col">PreProcessing Result</th>
            </tr>
          </thead>
          <tbody>
            {dataResult.slice(startIndex, endIndex).map((item, number) => (
              <tr key={number + 1}>
                <td>{number + 1}</td>
                <td>{item.original_casefolding}</td>
                <td>{item.slangremove_andfinaltext}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div class="flexx next_and_prev_btn_container">
          <div>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
          </div>
          <div class="total_pages">
            <p>
              {currentPage} / {Math.ceil(dataResult.length / rowsPerPage)}
            </p>
          </div>
          <div>
            <button
              disabled={endIndex >= dataResult.length}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultPreprocessing;
