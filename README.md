# React DataTable Plugin

A customizable, accessible, React DataTable component with sorting, filtering, pagination, and theming support. Built with full WCAG 2.1 AA accessibility compliance.

## ✨ Features

- ✅ **Accessibility**: WCAG 2.1 AA compliant with ARIA labels, keyboard navigation, and screen reader support
- 📊 **Sorting**: Multi-column sorting with customizable sort logic
- 🔍 **Search**: Global and column-specific search capabilities
- 📄 **Pagination**: Client-side pagination with customizable page sizes
- 🎨 **Theming**: Built-in light/dark themes with custom styling support
- ♿ **Keyboard Navigation**: Keyboard support for all interactive elements
- 📱 **Responsive**: Adapts to different screen sizes
- 🔧 **Customizable**: Render functions, custom styles, and extensive callbacks
- ⚡ **Optimized Performance**: Memoized computations for smooth performance

## 📦 Installation

```bash
# Using npm
npm install react-datatable-plugin

# Using yarn
yarn add react-datatable-plugin

# Using pnpm
pnpm add react-datatable-plugin
```

## ⚙️ Usage

Here's a basic example to get you started:

### Basic Example

```jsx
import React from 'react';
import DataTable from 'react-datatable-plugin';

const App = () => {
  const data = [
    { id: 1, name: 'John Doe', age: 30, department: 'Engineering' },
    { id: 2, name: 'Jane Smith', age: 25, department: 'Marketing' },
  ];

  const columns = [
    { dataKey: 'name', title: 'Name', sortable: true },
    { dataKey: 'age', title: 'Age', sortable: true },
    { dataKey: 'department', title: 'Department', sortable: true },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      itemsPerPage={10}
      searchable={true}
      sortable={true}
      pagination={true}
      theme="light"
    />
  );
};

export default App;
```

### Props

| Prop             | Type                   | Description                                      |
|------------------|------------------------|--------------------------------------------------|
| `data`           | array                 | Array of data rows.                               |
| `columns`        | array                 | Array of column definitions.                      |
| `itemsPerPage`   | number                | Number of rows per page (default: 10).            |
| `searchable`     | boolean               | Enable/disable search (default: true).            |
| `sortable`       | boolean               | Enable/disable sorting (default: true).           |
| `pagination`     | boolean               | Enable/disable pagination (default: true).        |
| `striped`        | boolean               | Zebra-striped rows (default: false).              |
| `theme`          | string                | Theme to use (`light`, `dark`).                   |
| `searchPlaceholder`  | string             | Search input placeholder (default: "Search...").   |
| `emptyMessage`    | string             | Empty state message (default: "No data available").|
| `loading`         | boolean            | Loading state (default: false).                    |
| `loadingMessage`  | string             | Loading message (default: "Loading data...").      |
| `tableId`         | string              | Table ID for accessibility (default: "data-table").|
| `ariaLabel`       | string              | ARIA label for screen reader (default: "Data table").|
| `rowKey`          | string              | Unique key property for rows (default: "id").     |
| `showRowNumbers`  | boolean            | Show row numbers (default: false).                |

### Column Configuration

Each column object can have:

```jsx
{
  dataKey: 'name', // Required: property name in data
  title: 'Full Name', // Required: column header text
  sortable: true, // Optional: default true
  searchable: true, // Optional: default true
  width: '150px', // Optional: column width
  align: 'left', // Optional: 'left' | 'center' | 'right'
  headerClassName: 'custom-header', // Optional: header class
  headerStyle: { fontWeight: 'bold' }, // Optional: header styles
  render: (value, row, rowIndex) => { return <span className="highlight">{value}</span>; }, // Custom cell renderer
  cellClassName: (row) => row.status === 'active' ? 'active' : '', // Dynamic cell class
  cellStyle: (row) => ({ color: row.status === 'active' ? 'green' : 'red' }), // Dynamic cell styles
}
```

### Theming

#### Using Built-in Themes

```jsx
<DataTable theme="dark" striped={true} />
```

#### Custom CSS Overrides

```css
/* Override DataTable styles */
.data-table {
  --dt-primary-color: #007bff;
  --dt-border-color: #dee2e6;
  --dt-header-bg: #f8f9fa;
}

.data-table.dark-theme {
  --dt-primary-color: #0d6efd;
  --dt-bg-color: #212529;
  --dt-text-color: #f8f9fa;
}
```

### Accessibility

The DataTable includes:

✅ ARIA labels for all interactive elements
✅ Keyboard navigation (Tab, Enter, Space, Arrow keys)
✅ Screen reader support
✅ Proper table semantics
✅ Focus management

### Keyboard Navigation

- Tab: Navigate through interactive elements
- Enter/Space: Activate sort on headers
- Arrow Keys: Navigate pagination controls
- Escape: Close dropdowns

### Performance Tips

- Memoize Data: Use useMemo for derived data
- Virtualization: For large datasets, consider implementing virtualization
- Column Optimization: Only include necessary columns
- Pagination: Use server-side pagination for very large datasets

### Example with Redux

```jsx
import React from 'react';
import { useSelector } from 'react-redux';
import DataTable from 'react-datatable-plugin';

const EmployeeTable = () => {
  const employees = useSelector(state => state.employees);
  const isLoading = useSelector(state => state.loading);

  const columns = [
    { dataKey: 'firstName', title: 'First Name', sortable: true },
    { dataKey: 'lastName', title: 'Last Name', sortable: true },
    { dataKey: 'department', title: 'Department', sortable: true },
  ];

  return (
    <DataTable
      data={employees}
      columns={columns}
      loading={isLoading}
      ariaLabel="Employee directory"
      tableCaption="Company Employees"
    />
  );
};
```

### Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Opera 47+

### Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

### License

MIT © amandinedev

### Additional Components

The plugin includes these sub-components:

- SearchBar: Customizable search input
- PageSizeSelector: Dropdown for items per page
- Pagination: Navigation controls
- TableInfo: Showing X to Y of Z entries

Each component can be used independently if needed.

### Support

For issues and feature requests, please use the GitHub Issues page.