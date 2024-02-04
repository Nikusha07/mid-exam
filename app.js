#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

const expenseFilePath = path.join(__dirname, 'expenses.json');

program
  .version('1.0.0')
  .description('Expense Manager CLI');

program
  .command('create-expense <total> <category> <date>')
  .description('Create a new expense')
  .action((total, category, date) => {
    const newExpense = { total, category, date };
    const expenses = loadExpenses();
    expenses.push(newExpense);
    saveExpenses(expenses);
    console.log('Expense created successfully.');
  });

program
  .command('search-expense')
  .description('Search expenses by category')
  .option('--category <category>', 'Search by category')
  .action((options) => {
    const expenses = loadExpenses();
    const filteredExpenses = expenses.filter(expense => expense.category === options.category);
    console.log(filteredExpenses);
  });

program
  .command('delete-expense')
  .description('Delete an expense by id')
  .option('--id <id>', 'Expense id to delete')
  .action((options) => {
    const expenses = loadExpenses();
    const index = expenses.findIndex(expense => expense.id === parseInt(options.id));
    if (index !== -1) {
      expenses.splice(index, 1);
      saveExpenses(expenses);
      console.log('Expense deleted successfully.');
    } else {
      console.log('Expense not found.');
    }
  });

program.parse(process.argv);

function loadExpenses() {
  try {
    const data = fs.readFileSync(expenseFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveExpenses(expenses) {
  fs.writeFileSync(expenseFilePath, JSON.stringify(expenses, null, 2), 'utf8');
}
