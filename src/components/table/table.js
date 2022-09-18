import React, { useState } from "react";

import {
  useTable,
  usePagination,
  useGlobalFilter,
  useSortBy,
} from "react-table";

export default function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setGlobalFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const [filterInput, setFilterInput] = useState("");

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined || "";
    setGlobalFilter(value || undefined || "");
    setFilterInput(value);
  };

  return (
    <div className="pb-2">
      <div className="row mb-1">
        <div className="col-3">
          <input
            className="form-control"
            value={filterInput}
            onChange={handleFilterChange}
            placeholder={"Search..."}
          />
        </div>
        <div className="col"></div>
        <div className="col-2 text-end">
          <select
            className="form-control form-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      <table
        className="table table-bordered bg-white text-center table-striped"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  style={{ verticalAlign: "middle" }}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={
                    column.isSorted
                      ? column.isSortedDesc
                        ? "sort-desc"
                        : "sort-asc"
                      : ""
                  }
                >
                  {column.render("Header")}
                  {column.isSorted
                    ? column.isSortedDesc
                      ? " ↑ "
                      : " ↓ "
                    : " ↕ "}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      style={{
                        verticalAlign: "middle",
                        whiteSpace:
                          cell.column.id === "action" ? "nowrap" : "none",
                      }}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="relative pagination">
        <div className="btn-group">
          <button
            className="btn btn-white btn-sm border-0"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {<i className="fas fa-angle-double-left"></i>}
          </button>{" "}
          <button
            className="btn btn-white btn-sm border-0"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {<i className="fas fa-angle-left"></i>}
          </button>{" "}
          <button
            className="btn btn-white btn-sm border-0"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {<i className="fas fa-angle-right "></i>}
          </button>{" "}
          <button
            className="btn btn-white btn-sm border-0"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {<i className="fas fa-angle-double-right"></i>}
          </button>{" "}
        </div>
        &nbsp;
        <span className="my-auto">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
      </div>
    </div>
  );
}

// export default App;
