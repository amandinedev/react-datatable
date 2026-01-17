import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DataTable from '../src/components/DataTable'

describe('DataTable', () => {
  const mockData = [
    { id: 1, firstName: 'John', LastName:'Doe', department: 'Engineering' },
    { id: 2, firstName: 'Jane', LastName: 'Smith', department: 'Marketing' },
  ]

  const columns = [
    { title: 'First Name', dataIndex: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName' },
    { title: 'Department', dataIndex: 'department' },
  ]

  it('renders table with provided data and columns', () => {
    render(<DataTable data={mockData} columns={columns} />)

    // Check column headers
    expect(screen.getByText('firstName')).toBeInTheDocument()
    expect(screen.getByText('lastName')).toBeInTheDocument()
    expect(screen.getByText('Department')).toBeInTheDocument()

    // Check data
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Doe')).toBeInTheDocument()
    expect(screen.getByText('Engineering')).toBeInTheDocument()
    expect(screen.getByText('Jane')).toBeInTheDocument()
    expect(screen.getByText('Smith')).toBeInTheDocument()
    expect(screen.getByText('Marketing')).toBeInTheDocument()
  })
})