import React, { useState } from "react";

const RemoveCharacter = ({ dataRemoveCharacter, removepunctuation }) => {
  const totalData = dataRemoveCharacter.length;

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const startIndex = (currentPage - 1) * rowsPerPage;

  const endIndex = Math.min(
    startIndex + rowsPerPage,
    dataRemoveCharacter.length
  );

  return (
    <>
      <div>
        <div class="title_page">
          <h1>Remove Emoji</h1>
        </div>
        <div class="page_explain">
          <p>
            The purpose of removing emojis in the preprocessing step is to clean
            the emoji characters from text that are contained within data
            tweets.
          </p>
        </div>
        <button class="pages_inputcsv" onClick={() => removepunctuation()}>
          Remove Punctuation
        </button>
      </div>
      <div class="csv_table">
        <span>Total data: {totalData}</span>
        <table>
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Case Folding Result</th>
              <th scope="col">Conversion Results (Remove Emoji)</th>
            </tr>
          </thead>
          <tbody>
            {dataRemoveCharacter
              .slice(startIndex, endIndex)
              .map((item, number) => (
                <tr key={number + 1}>
                  <td>{startIndex + number + 1}</td>
                  <td>{item.original_emoji}</td>
                  <td>{item.removeemoji_text}</td>
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
              {currentPage} /{" "}
              {Math.ceil(dataRemoveCharacter.length / rowsPerPage)}
            </p>
          </div>
          <div>
            <button
              disabled={endIndex >= dataRemoveCharacter.length}
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

export default RemoveCharacter;
