import React, { useState } from "react";

const FilteringPage = ({ dataFiltering, tokenize }) => {
  const totalData = dataFiltering.length;

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, dataFiltering.length);

  return (
    <>
      <div>
        <div class="title_page">
          <h1>Remove Punctuation</h1>
        </div>
        <div class="page_explain">
          <p>
            The purpose of filtering in the preprocessing step is to remove
            unwanted elements such as question marks (?), exclamation marks (!),
            periods (.), commas (,), and various other types of symbols from the
            text.
          </p>
        </div>
        <button class="pages_inputcsv" onClick={() => tokenize()}>
          Tokenization
        </button>
      </div>
      <div class="csv_table">
        <span>Total data: {totalData}</span>
        <table>
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Remove Emoji Result</th>
              <th scope="col">Conversion Results (Remove Punctuation)</th>
            </tr>
          </thead>
          <tbody>
            {dataFiltering.slice(startIndex, endIndex).map((item, number) => (
              <tr key={number + 1}>
                <td>{startIndex + number + 1}</td>
                <td>{item.original_cleansing}</td>
                <td>{item.cleansing_text}</td>
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
              {currentPage} / {Math.ceil(dataFiltering.length / rowsPerPage)}
            </p>
          </div>
          <div>
            <button
              disabled={endIndex >= dataFiltering.length}
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

export default FilteringPage;
