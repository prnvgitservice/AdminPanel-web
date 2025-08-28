// src/utils/quillSetup.ts
import Quill from 'quill';
import betterTableModule from 'quill-better-table/dist/quill-better-table.js';

// Register quill-better-table
console.log('BetterTableModule:', betterTableModule); // Debug to confirm import
Quill.register({ 'modules/better-table': betterTableModule }, true);

export default Quill;
// // src/utils/quillSetup.ts
// import Quill from 'quill';
// // import BetterTable from 'quill-better-table/dist/quill-better-table.js';/////////

// // Register quill-better-table
// try {
//   // console.log('BetterTableModule:', BetterTable); // Debug to confirm import
//   // Quill.register('modules/better-table', BetterTable, true);
// } catch (error) {
//   console.error('Failed to load quill-better-table:', error);
//   // Fallback to quill-table
//   try {
//     // Dynamic import to handle potential module issues
//     import('quill-table').then((module) => {
//       const TableModule = module.TableModule;
//       console.log('TableModule:', TableModule); // Debug to confirm import
//       Quill.register('modules/table', TableModule, true);
//     });
//   } catch (fallbackError) {
//     console.error('Failed to load quill-table:', fallbackError);
//   }
// }

// export default Quill;

// // src/utils/quillSetup.ts
// import Quill from 'quill';
// // import quill-table from 'quill-table'; // Removed invalid import


// // Attempt to import quill-table
// (async () => {
//   try {
//     const quillTable = await import('quill-table');
//     const TableModule = quillTable.TableModule;
//     console.log('TableModule:', TableModule); // Debug to confirm import
//     Quill.register('modules/table', TableModule, true);
//   } catch (error) {
//     console.error('Failed to load quill-table:', error);
//     // Fallback to quill-better-table
//     const betterTable = await import('quill-better-table');
//     const BetterTable = betterTable.default;
//     Quill.register('modules/better-table', BetterTable, true);
//   }
// })();

// export default Quill;