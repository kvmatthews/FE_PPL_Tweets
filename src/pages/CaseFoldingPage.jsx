import React, { useState } from "react";

const CaseFoldingPage = ({ caseFolding, removecharcater }) => {
  const totalData = caseFolding.length;

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, caseFolding.length);

  return (
    <>
      <div>
        <div class="title_page">
          <h1>Case Folding</h1>
        </div>
        <div class="page_explain">
          <p>
            The purpose of case folding in the preprocessing step is to convert
            all the characters in the text into a uniform format, such as
            changing capital letters to lowercase letters. Case folding helps
            simplify text and ensures uniformity in text analysis, regardless of
            differences in capitalization and size.
          </p>
        </div>
        <button class="pages_inputcsv" onClick={() => removecharcater()}>
          Remove Character
        </button>
      </div>
      <div class="csv_table">
        <span>Total data: {totalData}</span>
        <table>
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Data Tweets Original</th>
              <th scope="col">Conversion Results (Case Folding)</th>
            </tr>
          </thead>
          <tbody>
            {caseFolding.slice(startIndex, endIndex).map((item, number) => (
              <tr key={number + 1}>
                <td>{startIndex + number + 1}</td>
                <td>{item.original_casefolding}</td>
                <td>{item.casefolding_text}</td>
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
              {currentPage} / {Math.ceil(caseFolding.length / rowsPerPage)}
            </p>
          </div>
          <div>
            <button
              disabled={endIndex >= caseFolding.length}
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

export default CaseFoldingPage;
