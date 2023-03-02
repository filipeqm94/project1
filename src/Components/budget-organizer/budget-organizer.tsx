// third party imports
import React, { useEffect, useState } from 'react'

// internal imports
import { TExpense, TDisplayError } from '../../Types/types'

/**
 * Budget Organizer Main Component
 */
export default function BudgetOrganizer() {
  // initial states
  const initialDisplayError: TDisplayError = { message: '' }
  const initialNewExpense: TExpense = {
    name: '',
    value: 0,
  }

  // useState
  const [displayError, setDisplayError] = useState<TDisplayError>(initialDisplayError)
  const [expenses, setExpenses] = useState<TExpense[]>([])
  const [total, setTotal] = useState<number>(0)
  const [newExpense, setNewExpense] = useState<TExpense>(initialNewExpense)

  // useEffect
  useEffect(() => {
    setTotal(() => {
      return expenses.reduce((prevValue: number, currValue: TExpense) => {
        return prevValue + currValue.value
      }, 0)
    })
  }, [expenses])

  // internal methods
  /**
   * New Expense Change Handler
   * 
   * @param event react change event
   */
  function handleNewExpenseChange(event: React.ChangeEvent): void {
    const target = event.target as HTMLInputElement
    setNewExpense((prevNewExpense: TExpense) => {
      return {
        ...prevNewExpense,
        // depending on id keep value as string or cast value to number
        [target.id]: target.id === 'name' ? target.value : Number(target.value),
      }
    })
  }

  /**
   * Handle New Expense form submission
   * 
   * @param event react form event
   */
  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault()

    // validation check
    if (!newExpense.name || !newExpense.value) {
      setDisplayError({
        message: 'Please input an expense Name and Value to proceed.',
      })
    } else {
      // reset error display message
      setDisplayError(initialDisplayError)

      // add new expense to the bottom of the list
      setExpenses((prevExpenses: TExpense[]) => [...prevExpenses, newExpense])

      // reset initial expense form
      setNewExpense(initialNewExpense)
    }
  }

  return (
    <>
      <h3>Enter new budget:</h3>
      <form onSubmit={handleSubmit}>
        {displayError ? (
          <div className='error'>{displayError.message}</div>
        ) : null}
        <div>
          <label htmlFor='name'>Expense name:</label>
          <input
            id='name'
            type='text'
            required
            value={newExpense?.name}
            onChange={handleNewExpenseChange}
          />
        </div>
        <div>
          <label htmlFor='value'>Expense value:</label>
          <input
            id='value'
            type='number'
            required
            value={newExpense?.value}
            onChange={handleNewExpenseChange}
          />
        </div>
        <button type='submit'>Save Expense</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Expense</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((element: TExpense, index: number) => {
            return (
              <tr key={index}>
                <td>{element.name}</td>
                <td>{element.value}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{total}</td>
          </tr>
        </tfoot>
      </table>
    </>
  )
}
