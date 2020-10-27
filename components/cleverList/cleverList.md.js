export default `- a virtualized item-list component (note: there is lots of advanced functionality available, ask jbyrd@ns1.com for help if you are bumping into shortcomings and i'll add more documentation.)
- **formatting** *(func)* this function will be called with the list item object and its return value will be displayed for the row
- **onSelect** *(func)* this function will be called with the list item object when an item is selected
- **interior** *(bool)* if the list is meant to be contained (ie: not full page), set this to true
- **itemsVisible** *(int)* if interior is true, we will only show this many items in a list. if interior is false, the list will expand to fill the page.
- **pills** *(array[func])* for each function in this array, we create a pill in the item row with the string returned. the function is passed the item for the current row.
- **items** *(array[object])* this array is the list items. items can have arbitrary keys
- **options** *(array[object])* each object in the array defines an entry in the dropdown menu for this item. available keys are icon, name, and onClick. onclick is a function that is passed: the item object, the index, and a method for selecting the row in the list.
`;
