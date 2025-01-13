// Function to generate the spreadsheet
function generateSpreadsheet(rows, cols) {
  const container = document.getElementById("spreadsheet-container");
  const table = document.createElement("table");
  
  // Create header row
  const headerRow = document.createElement("tr");
  const headerEmptyCell = document.createElement("th");
  headerRow.appendChild(headerEmptyCell)
  for (let col = 0; col < cols; col++) {
      const headerCell = document.createElement("th");
      headerCell.textContent = String.fromCharCode(65 + col); // A, B, C, ...
      headerRow.appendChild(headerCell);
  }
  table.appendChild(headerRow);

  // Create data rows
  for (let row = 0; row < rows; row++) {
      const dataRow = document.createElement("tr");
      const headerCell = document.createElement("th");
      headerCell.textContent = row+1
      dataRow.appendChild(headerCell)
      for (let col = 0; col < cols; col++) {
          const dataCell = document.createElement("td");
          const input = document.createElement("input");
          input.type = "text";
          input.dataset.row = row
          input.dataset.col = col
          dataCell.appendChild(input);
          dataRow.appendChild(dataCell);
      }
       table.appendChild(dataRow);
  }
  container.appendChild(table);
}
// Generate the spreadsheet (adjust the rows and cols as you want)
generateSpreadsheet(10, 5);

// Mathematical functions
function SUM(args) {
  let sum = 0;
  for (const arg of args) {
      const value = parseFloat(arg);
    if (!isNaN(value)) {
          sum += value;
      }
  }
  return sum;
}

function AVERAGE(args) {
    let sum = 0;
    let count = 0;
    for (const arg of args) {
        const value = parseFloat(arg);
        if (!isNaN(value)) {
          sum += value;
          count++;
      }
    }
  return count === 0 ? 0 : sum / count;
}

function MAX(args) {
    let max = -Infinity;
    for (const arg of args) {
        const value = parseFloat(arg);
        if (!isNaN(value) && value > max) {
            max = value
        }
    }
    return max === -Infinity ? 0 : max;
}

function MIN(args) {
    let min = Infinity;
    for (const arg of args) {
        const value = parseFloat(arg);
      if (!isNaN(value) && value < min) {
          min = value;
      }
    }
    return min === Infinity ? 0 : min;
}
 function COUNT(args){
  let count = 0;
     for (const arg of args){
         const value = parseFloat(arg)
         if (!isNaN(value)) {
             count++;
         }
    }
  return count;
}
// Data Quality Functions
 function TRIM(arg) {
      return String(arg).trim();
 }
 function UPPER(arg) {
   return String(arg).toUpperCase();
 }
  function LOWER(arg) {
       return String(arg).toLowerCase();
 }
function REMOVE_DUPLICATES(args){
      if (args.length < 2) {
         return "#ERROR";
      }
     const table = document.querySelector("#spreadsheet-container table");
     const selectedRow = parseInt(args[0]) - 1;
    const selectedCol = parseInt(args[1]) - 1;
      const selectedLength = 3;
      if (isNaN(selectedRow) || isNaN(selectedCol)) {
          return "#ERROR";
      }
    if(selectedRow >= table.rows.length || selectedCol >= table.rows[0].cells.length){
         return "#ERROR";
     }
     const rows = [];
     for(let i = selectedRow; i < table.rows.length; i++){
          const values = [];
          for(let j = selectedCol; j < selectedCol+selectedLength; j++){
             if (table.rows[i].cells[j] && table.rows[i].cells[j].children.length > 0){
                 values.push(table.rows[i].cells[j].children[0].value)
              }else{
                   values.push("")
            }
        }
        rows.push(values);
      }
     const uniqueRows = [];
    const seen = new Set();
    for (const row of rows) {
        const rowString = JSON.stringify(row);
         if (!seen.has(rowString)) {
              uniqueRows.push(row);
             seen.add(rowString);
          }
     }
     let counter = 0;
      for (let i = selectedRow; i < table.rows.length;) {
         if (uniqueRows[counter]) {
            for (let j = selectedCol; j < selectedCol + selectedLength; j++) {
                 if (table.rows[i].cells[j] && table.rows[i].cells[j].children.length > 0){
                     table.rows[i].cells[j].children[0].value = uniqueRows[counter][j-selectedCol];
                 }
            }
            counter++;
           i++;
        }
        else {
             table.deleteRow(i);
             i--;
         }
     }
     for(let i=selectedRow+1; i < table.rows.length; i++){
          if (table.rows[i] && table.rows[i].cells.length > 0){
              table.rows[i].cells[0].textContent = i;
                for (let j= 0; j< table.rows[i].cells.length-1; j++){
                     if ( table.rows[i].cells[j+1].children.length > 0){
                         table.rows[i].cells[j+1].children[0].dataset.row = i-1;
                      }
                 }
          }
     }
    return "Removed duplicates";
}
 function FIND_AND_REPLACE(args){
     if(args.length < 2){
          return "#ERROR"
    }
    const table = document.querySelector("#spreadsheet-container table");
      const searchValue = args[0];
     const replaceValue = args[1];
       for(let i=1; i < table.rows.length; i++){
           for (let j=1; j< table.rows[i].cells.length; j++){
                if (table.rows[i].cells[j].children.length > 0){
                    if(table.rows[i].cells[j].children[0].value === searchValue){
                        table.rows[i].cells[j].children[0].value = replaceValue;
                     }
                 }
           }
      }
      return "Find and Replace";
}
// Function to evaluate a simple formula
function evaluateFormula(formula, cell) {
  try {
      const upperCaseFormula = formula.toUpperCase().replace(/ /g, "");
      if (upperCaseFormula.startsWith("=")) {
          formula = formula.slice(1);
          // Check for built-in functions
          const functionRegex =  /([A-Z]+)\(([^)]*)\)/;
           const match = formula.match(functionRegex);
          if (match){
              const functionName = match[1];
              const functionArguments = match[2].split(",").map(arg => arg.trim());
               const resolvedArguments = functionArguments.map(arg =>{
                  const cellRegex = /([A-Z]+)([0-9]+)/
                   const cellMatch = arg.match(cellRegex)
                      if(cellMatch){
                          const colIndex = cellMatch[1].charCodeAt(0) - 65;
                          const rowIndex = parseInt(cellMatch[2]) - 1;
                          const referencedInput = document.querySelector(`input[data-row="${rowIndex}"][data-col="${colIndex}"]`);
                          if (referencedInput){
                              return referencedInput.value
                          }
                     }
                      return arg
                  }
               )
               if (functionName === "SUM"){
                 return SUM(resolvedArguments)
               }
                if (functionName === "AVERAGE"){
                   return AVERAGE(resolvedArguments)
               }
                if (functionName === "MAX"){
                  return MAX(resolvedArguments)
               }
                if (functionName === "MIN"){
                    return MIN(resolvedArguments)
               }
                 if (functionName === "TRIM"){
                    return TRIM(resolvedArguments[0])
               }
                 if (functionName === "UPPER"){
                    return UPPER(resolvedArguments[0])
               }
                 if (functionName === "LOWER"){
                     return LOWER(resolvedArguments[0])
               }
                   if (functionName === "COUNT"){
                       return COUNT(resolvedArguments)
                    }
                   if (functionName === "REMOVE_DUPLICATES"){
                       return REMOVE_DUPLICATES(resolvedArguments)
                   }
                   if (functionName === "FIND_AND_REPLACE"){
                       return FIND_AND_REPLACE(resolvedArguments)
                    }
          } else{
               let sum = 0;
              const parts = formula.split("+");
              for (const part of parts){
                   const cellRegex = /([A-Z]+)([0-9]+)/
                  const cellMatch = part.match(cellRegex)
                   if (cellMatch){
                      const colIndex = cellMatch[1].charCodeAt(0) - 65;
                      const rowIndex = parseInt(cellMatch[2]) - 1;
                       const referencedInput = document.querySelector(`input[data-row="${rowIndex}"][data-col="${colIndex}"]`);
                     if (referencedInput){
                         const value = parseFloat(referencedInput.value);
                          if (!isNaN(value)) {
                              sum += value;
                          }
                       }
                  }else{
                      const value = parseFloat(part)
                      if (!isNaN(value)) {
                          sum += value
                       }
                  }
              }
               return sum;
         }
      } else {
          return formula;
      }
  } catch (error) {
      return "#ERROR";
  }
}
// Function to update the value of a cell based on its formula
function updateCellValue(input) {
 const row = parseInt(input.dataset.row);
 const col = parseInt(input.dataset.col);
 const formula = input.value;
 const result = evaluateFormula(formula, input)
 input.value = result
}

// Event listener for input changes in cells
document.addEventListener("change", function(event){
  if (event.target.tagName === "INPUT" ){
       updateCellValue(event.target)
      }
});
let selectedCell = null;

// Function to display formula bar
function displayFormulaBar(input) {
   if (input.value.startsWith("=")) {
          document.getElementById('formula-input').value = input.value;
      }
      else{
         document.getElementById('formula-input').value = input.value;
      }
  }
  // Function to get the address of the cell.
  function getCellAddress(input) {
      const row = parseInt(input.dataset.row) + 1;
      const col = String.fromCharCode(parseInt(input.dataset.col) + 65);
      return col+row
  }
  
  // Event listener to handle cell clicks (display formula and cell address)
  document.addEventListener("click", function(event){
      if (event.target.tagName === "INPUT" ){
          selectedCell = event.target
           if (selectedCell.value.startsWith("=")){
               displayFormulaBar(selectedCell);
           }else{
                displayFormulaBar({value: selectedCell.value})
           }
          document.getElementById('name-box').textContent = getCellAddress(selectedCell)
       }
  });
// Event listener to handle formula bar changes
document.getElementById("formula-input").addEventListener("change", function(event){
      if(selectedCell){
           if(event.target.value !== selectedCell.value){
               selectedCell.value = event.target.value;
            updateCellValue(selectedCell);
            }
        }
        if (!selectedCell && document.getElementById("name-box").value !== ""){
           const input = document.querySelector(`input[data-row="${document.getElementById("name-box").value.slice(1)-1}"][data-col="${document.getElementById("name-box").value.slice(0,1).toUpperCase().charCodeAt(0) - 65}"]`)
             if(input){
                 input.value = event.target.value;
                  updateCellValue(input)
             }
         }
 });

  let resizing = null;
   let startX = 0;
   let startWidth = 0;
  document.addEventListener('mousedown', function(e) {
      if (e.target.tagName === 'TH' && e.offsetX > e.target.offsetWidth - 10 || (e.target.tagName === 'TD' && e.offsetX > e.target.offsetWidth - 10)) {
          resizing = e.target;
          startX = e.clientX;
          startWidth = e.target.offsetWidth;
      }
  });

  document.addEventListener('mousemove', function(e) {
     if (resizing) {
          const width = startWidth + (e.clientX - startX);
          resizing.style.minWidth = width + 'px';
      }
  });
  document.addEventListener('mouseup', function() {
      resizing = null;
  });

 // Event listener for bold button
 document.getElementById("bold-btn").addEventListener("click", function() {
      if(selectedCell){
         if(selectedCell.style.fontWeight === "bold"){
               selectedCell.style.fontWeight = "normal"
         } else{
           selectedCell.style.fontWeight = "bold";
         }
       }
  });
  // Event listener for italic button
 document.getElementById("italic-btn").addEventListener("click", function() {
      if(selectedCell){
        if(selectedCell.style.fontStyle === "italic"){
              selectedCell.style.fontStyle = "normal"
        } else{
            selectedCell.style.fontStyle = "italic";
           }
      }
 });

let dragStartCell = null;
let isDragging = false;

document.addEventListener('mousedown', function(event) {
  if (event.target.tagName === 'INPUT') {
      dragStartCell = event.target;
      isDragging = true;
   }
});

document.addEventListener('mousemove', function(event) {
 if (isDragging && event.target.tagName === 'INPUT' ) {
      event.preventDefault(); // Prevent text selection during drag
 }
});


document.addEventListener('mouseup', function(event) {
  if (event.target.tagName === 'INPUT' && dragStartCell) {
     if (dragStartCell !== event.target){
         event.target.value = dragStartCell.value
         updateCellValue(event.target)
      }
      dragStartCell = null;
    isDragging = false;
  }
});
     // Event listener for add row button (add to last position)
   document.getElementById("add-row-btn").addEventListener("click", function() {
        const table = document.querySelector("#spreadsheet-container table")
          const rows = table.rows.length;
            const cols = table.rows[0].cells.length-1
         const dataRow = document.createElement("tr");
            const headerCell = document.createElement("th");
            headerCell.textContent = rows;
           dataRow.appendChild(headerCell)
          for (let col = 0; col < cols; col++) {
              const dataCell = document.createElement("td");
               const input = document.createElement("input");
               input.type = "text";
                 input.dataset.row = rows-1
               input.dataset.col = col
              dataCell.appendChild(input);
               dataRow.appendChild(dataCell);
         }
          table.appendChild(dataRow);
    });

    // Event listener for add column button (add to last position)
  document.getElementById("add-col-btn").addEventListener("click", function() {
        const table = document.querySelector("#spreadsheet-container table");
         const headerRow = table.rows[0];
        const newColIndex = headerRow.cells.length;
          for(let i =0; i < table.rows.length; i++){
               const header = table.rows[0].cells;
              const currentCell = table.rows[i].insertCell(-1);
               if(i == 0){
                    const headerCell = document.createElement("th")
                   headerCell.textContent = String.fromCharCode(65+newColIndex-1)
                    headerCell.classList.add("new-column-header")
                   currentCell.appendChild(headerCell)
                 } else{
                    const input = document.createElement("input");
                    input.type = "text";
                   input.dataset.row = i-1;
                  input.dataset.col = newColIndex-1
                 currentCell.appendChild(input)
             }
        }
   });
let selectedElement = null
// Context menu functionality
document.addEventListener('contextmenu', function(event) {
     if (event.target.tagName === 'TH' || event.target.tagName === 'TD') {
       event.preventDefault(); // Prevent the default context menu
          selectedElement = event.target
  
        let menu = document.getElementById("custom-context-menu")
          if (!menu){
              menu = document.createElement("div")
                menu.id = "custom-context-menu"
           document.body.appendChild(menu)
              menu.style.position = "absolute";
              menu.style.left = `${event.clientX}px`
               menu.style.top = `${event.clientY}px`
             menu.style.border = "1px solid black"
           menu.style.backgroundColor = "white";
           } else{
               menu.style.display = "block";
                menu.style.left = `${event.clientX}px`
                menu.style.top = `${event.clientY}px`
          }
        menu.innerHTML = "";
         const addRow = document.createElement("div")
         addRow.textContent = "Add Row"
        addRow.addEventListener('click', function(){
             menu.style.display = "none";
              const table = document.querySelector("#spreadsheet-container table")
             const rows = table.rows.length;
               const cols = table.rows[0].cells.length-1
              const dataRow = document.createElement("tr");
                const headerCell = document.createElement("th");
                 headerCell.textContent = rows;
                dataRow.appendChild(headerCell)
                for (let col = 0; col < cols; col++) {
                     const dataCell = document.createElement("td");
                     const input = document.createElement("input");
                      input.type = "text";
                     input.dataset.row = rows-1
                      input.dataset.col = col
                      dataCell.appendChild(input);
                    dataRow.appendChild(dataCell);
                 }
                 table.appendChild(dataRow);
       });
        const addColumn = document.createElement("div");
        addColumn.textContent = "Add Column";
      addColumn.addEventListener('click', function(){
          menu.style.display = "none";
           const table = document.querySelector("#spreadsheet-container table");
            const headerRow = table.rows[0];
          const newColIndex = headerRow.cells.length;
         for(let i =0; i < table.rows.length; i++){
              const header = table.rows[0].cells;
               const currentCell = table.rows[i].insertCell(-1);
              if(i == 0){
                    const headerCell = document.createElement("th")
                   headerCell.textContent = String.fromCharCode(65+newColIndex-1)
                     headerCell.classList.add("new-column-header")
                     currentCell.appendChild(headerCell)
                 } else{
                   const input = document.createElement("input");
                   input.type = "text";
                   input.dataset.row = i-1;
                 input.dataset.col = newColIndex-1
                     currentCell.appendChild(input)
               }
          }
     });
      const deleteRow = document.createElement("div");
      deleteRow.textContent = "Delete Row";
    deleteRow.addEventListener('click', function(){
          menu.style.display = "none";
         const table = document.querySelector("#spreadsheet-container table");
           const selectedRow = parseInt(selectedElement.closest('tr').rowIndex);
         table.deleteRow(selectedRow);
         for (let i = selectedRow; i < table.rows.length; i++){
            table.rows[i].cells[0].textContent = i+1;
               for (let j = 0; j< table.rows[i].cells.length-1; j++){
                   table.rows[i].cells[j+1].children[0].dataset.row = i-1;
                  }
          }
   })

   const deleteColumn = document.createElement("div");
    deleteColumn.textContent = "Delete Column";
  deleteColumn.addEventListener('click', function(){
      menu.style.display = "none";
    const table = document.querySelector("#spreadsheet-container table");
     const selectedCol = parseInt(selectedElement.cellIndex);
     for (let i = 0; i < table.rows.length; i++) {
        table.rows[i].deleteCell(selectedCol);
         }
    const headerRow = table.rows[0];
    for(let j=selectedCol; j<headerRow.cells.length; j++){
        headerRow.cells[j].textContent = String.fromCharCode(65+j)
           for (let i= 1; i < table.rows.length; i++){
              table.rows[i].cells[j].children[0].dataset.col = j-1;
               }
         }
     })
  const fontSizeDiv = document.createElement("div");
     fontSizeDiv.textContent = "Font Size";
  const fontSizeInput = document.createElement("input");
     fontSizeInput.type = "number";
       fontSizeInput.value = "12";
         fontSizeInput.style.width = "50px"
         fontSizeInput.min = "8"
      fontSizeInput.max = "30"
        fontSizeInput.addEventListener("change", function(event){
         if (selectedElement){
               if (selectedElement.tagName === "INPUT"){
                   selectedElement.style.fontSize = event.target.value + "px"
                  } else{
                      if(selectedElement.children.length > 0){
                         selectedElement.children[0].style.fontSize = event.target.value + "px"
                       }
                   }
              }
       })
   fontSizeDiv.appendChild(fontSizeInput)
    const fontColorDiv = document.createElement("div")
    fontColorDiv.textContent = "Font Color";
      const fontColorInput = document.createElement("input")
      fontColorInput.type = "color";
      fontColorInput.value = "#000000";
     fontColorInput.addEventListener("change", function(event){
          if (selectedElement){
                if (selectedElement.tagName === "INPUT"){
                    selectedElement.style.color = event.target.value
                   } else{
                     if(selectedElement.children.length > 0){
                          selectedElement.children[0].style.color = event.target.value
                       }
                  }
           }
      });
      fontColorDiv.appendChild(fontColorInput)
    const removeDuplicates = document.createElement("div")
     removeDuplicates.textContent = "Remove Duplicates"
  removeDuplicates.addEventListener("click", function(){
      menu.style.display = "none";
        if (selectedElement){
         const selectedRow = parseInt(selectedElement.closest('tr').rowIndex)+1
          const selectedCol =  parseInt(selectedElement.cellIndex)+1
          selectedElement.value =  `=REMOVE_DUPLICATES(${selectedRow}, ${selectedCol})`
           updateCellValue(selectedElement)
       }
  })
    menu.appendChild(addRow)
     menu.appendChild(addColumn)
    menu.appendChild(deleteRow)
      menu.appendChild(deleteColumn)
      menu.appendChild(fontSizeDiv)
      menu.appendChild(fontColorDiv)
      menu.appendChild(removeDuplicates)
 }  else{
       let menu = document.getElementById("custom-context-menu")
         if (menu){
          menu.style.display = "none";
          }
   }
});
document.addEventListener("click", function(event){
let menu = document.getElementById("custom-context-menu")
if (menu && event.target !== menu && !menu.contains(event.target)){
    menu.style.display = "none";
  }
     selectedCell = null;
});
   // Event listener for font size input
document.getElementById("font-size-input").addEventListener("change", function(event){
        if (selectedCell){
            selectedCell.style.fontSize = event.target.value + "px"
          }
});
// Event listener for font color input
document.getElementById("font-color-input").addEventListener("change", function(event){
     if (selectedCell){
        selectedCell.style.color = event.target.value
        }
});
// Event listener to toggle the File Menu
document.getElementById('file-btn').addEventListener('click', function() {
 let fileMenu = document.getElementById('file-menu');
  if(fileMenu.style.display === 'none'){
     fileMenu.style.display = 'block';
   } else{
      fileMenu.style.display = 'none';
  }
});
document.addEventListener("click", function(event){
    let fileMenu = document.getElementById("file-menu")
      if (fileMenu && event.target !== fileMenu && !fileMenu.contains(event.target) && event.target.id !== "file-btn"){
          fileMenu.style.display = "none";
      }
  });
  // Event listener for the "New File" button
document.getElementById("new-file-btn").addEventListener("click", function() {
  const container = document.getElementById("spreadsheet-container");
  container.innerHTML = "";
   generateSpreadsheet(10, 5);
 document.getElementById('file-menu').style.display = 'none';
});