# Google Sheets Mimic

This project is a web application that mimics the core functionalities of Google Sheets, as specified below. It provides a basic spreadsheet interface with cell input, formula evaluation, basic formatting, and data quality functions.

## Key Features Implemented

*   **Basic Spreadsheet Interface:**
    *   A functional grid of cells using an HTML table.
    *   A formula bar to display and edit the selected cell's content.
    *   A name box to display and input the cell address.
   *  Basic drag functionality to copy cell content.
    *   Resizable columns by dragging the column borders.
    *  Ability to add rows/columns, with basic options through the buttons in the toolbar, and with more options through right clicking in a cell.

*   **Cell Input and Editing:**
    *   Users can enter various data types (numbers, text, and formulas) directly into the cells, either through the input in the cell, or by using the formula bar.
    *  Basic cell selection, and updating of the selected cell value, by using the input field of the cell, or by using the formula bar, is also implemented.
*   **Formula Evaluation:**
    *   Basic cell dependencies using the addition (`+`) operator.
    *   Mathematical functions: `SUM`, `AVERAGE`, `MAX`, `MIN` and `COUNT`.
    *   Data quality functions: `TRIM`, `UPPER`, `LOWER`, `REMOVE_DUPLICATES`, and `FIND_AND_REPLACE`.

*   **Formatting:**
    *  Basic text format functionalities with bold and italic buttons.
   *   Font size and font color are also implemented.

*  **Testing**: The project was thoroughly tested, and all functionalities are working as intended.

## How to Run

1.  Clone the repository:

    ```bash
    git clone <YOUR_GITHUB_REPOSITORY_URL>
    ```
2.  Open `index.html` in your web browser.

## Github link

[Link to your github projet](<https://github.com/gunamadarapu/dev_pro>)

## Technologies Used

*   HTML
*   CSS
*   JavaScript

## Bonus Features

*   A basic “New File” button in the toolbar that clears the current spreadsheet.
*  The font size and the font color are selectable from the toolbar, and also from the right click context menu.
*  You can now type a cell address in the name box, to change the selected cell to that address.

## Functionality Overview

*   **Toolbar:** The toolbar at the top of the spreadsheet allows to open a dropdown menu with a "New File" option.
*   **Name Box:** The `name-box`, is an input field that shows the address of the currently selected cell, and it is also used to jump to another cell if the user types the address and press Enter, or clicks outside of it.
*   **Formula Bar:** The `formula-bar` contains the input field where the user can insert and visualize the value or the formula of the current cell.
*   **Spreadsheet Grid:**  The main interface is a grid of cells that allows you to enter different type of values and formulas.

## Data Validation

*   Data validation was not implemented, because the objective of this assignment is to allow any type of data in the cells (text, numbers, dates, etc), while providing error messages only if there is an error with the formulas.

## Context Menu

The context menu (right-click menu) will display the following options, if it is used in the header rows or columns:
* Add Row
* Add Column
* Delete Row
* Delete Column
* Font Size
* Font Color
* Remove Duplicates

## Known Limitations

*   **Basic Drag:** The drag functionality only copies cell contents. It does not copy formulas or other features.
*   **Partial UI Copy:** The UI is a basic implementation and it does not fully mimic the look and feel of Google Sheets.
*   **Limited Cell Dependencies:** Cell dependencies are handled using simple operations and are limited in their capabilities.
*   **Fixed REMOVE_DUPLICATES range:** The `REMOVE_DUPLICATES` function uses a fixed length of 3 columns to remove duplicates.
*   **Row Resizing:** The resizing functionality only modifies the column width, not the row height.

## Future Improvements

*   Add other math formulas (`-`, `*`, `/`, etc.).
*   Implement more complete cell dependencies.
* Implement more cell functionalities like drag, resize, add and delete rows and columns
* Implement Drag and drop functionalities for the formulas, and all the selection functionalities.
* Implement a save and load functionality.
*   Add charts and other data visualization functionalities.
*  Implement more advanced features like filtering, sorting, etc.
