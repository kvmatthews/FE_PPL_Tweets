import React, { useState } from "react";

const SlangPage = ({ dataSlang, result }) => {
  const totalData = dataSlang.length;

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, dataSlang.length);

  return (
    <>
      <div>
        <div class="title_page">
          <h1>Remove Slang</h1>
        </div>
        <div class="page_explain">
          <p>
            The purpose of removing slang is to eliminate or replace slang words
            in the text with standard or formal forms that are more commonly
            used. Slang is an informal language often used in everyday
            conversations, but in certain contexts or natural language
            processing applications, the use of slang words can affect text
            comprehension and analysis.
          </p>
        </div>
        <button class="pages_inputcsv" onClick={() => result()}>
          Result
        </button>
      </div>
      <div class="csv_table">
        <span>Total data: {totalData}</span>
        <table>
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Stemming Result</th>
              <th scope="col">Conversion Results (Slang)</th>
            </tr>
          </thead>
          <tbody>
            {dataSlang.slice(startIndex, endIndex).map((item, number) => (
              <tr key={number + 1}>
                <td>{startIndex + number + 1}</td>
                <td>{item.original_slangandfinaltext}</td>
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
              {currentPage} / {Math.ceil(dataSlang.length / rowsPerPage)}
            </p>
          </div>
          <div>
            <button
              disabled={endIndex >= dataSlang.length}
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

export default SlangPage;
