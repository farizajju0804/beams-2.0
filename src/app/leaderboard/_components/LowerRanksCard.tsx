import React from 'react';
import { Table, Avatar, TableHeader, TableBody, TableRow, TableCell, TableColumn } from "@nextui-org/react";

// Interface for the props that LowerRanksTable will accept
interface LowerRanksTableProps {
  users: any[]; // Array of user objects
  userPosition: number | undefined; // Position of the current user (optional)
}

// LowerRanksTable functional component
const LowerRanksTable: React.FC<LowerRanksTableProps> = ({ users, userPosition }) => {
  // Slicing the users array to get the lower-ranked users (positions 4 to 10)
  const lowerRankedUsers = users.slice(3, 10);

  // Define the columns for the table
  const columns = [
    { key: "rank", label: "RANK" },
    { key: "user", label: "NAME" },
    { key: "points", label: "POINTS" },
  ];

  // Function to render the cell content based on the column key
  const renderCell = (user: any, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof typeof user]; // Access the cell value dynamically

    switch (columnKey) {
      case "rank": // For the rank column
        return (
          <div className={`flex justify-center items-center`}>
            <span className="text-sm text-text font-bold">{user.rank}</span> {/* Display rank */}
          </div>
        );
      case "user": // For the user column
        return (
          <div className="flex items-center">
            <Avatar
              src={user?.user?.image || undefined} // User avatar image
              showFallback
              alt="profile"
              className="w-8 h-8 mr-2 flex-shrink-0" // Avatar styling
            />
            <span className='text-wrap flex-grow font-medium text-sm md:text-base'>
              {`${user.user?.firstName} ${user.user?.lastName} ${user.rank === userPosition ? '(You)' : ''}`} {/* Display user name and highlight if it's the current user */}
            </span>
          </div>
        );
      case "points": // For the points column
        return <span className='text-wrap mx-auto font-medium text-text text-sm'>{user.points}</span>; // Display points
      default:
        return cellValue; // Fallback for any unhandled column keys
    }
  };

  return (
    <Table
      aria-label="Lower Ranks Table"
      className="max-w-2xl mx-auto px-0 mt-10" // Table styling
      selectionMode="none" // Disable row selection
      classNames={{
        wrapper: "p-0 pb-2",
        th: 'rounded-0' // No rounded corners for header cells
      }}
    >
      {/* Table header with defined columns */}
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn 
            key={column.key}
            align={column.key === "rank" ? "center" : column.key === "points" ? "end" : "start"} // Align columns accordingly
          >
            {column.label} {/* Column label */}
          </TableColumn>
        )}
      </TableHeader>
      {/* Table body displaying lower-ranked users */}
      <TableBody items={lowerRankedUsers}>
        {(user) => (
          <TableRow 
            key={user.id} // Unique key for each row
            className={`my-2 ${user.rank === userPosition ? "font-bold font-poppins" : ""}`} // Highlight current user row
          >
            {(columnKey) => (
              <TableCell className={`py-4 ${columnKey === "points" ? "text-center" : ""}`}> {/* Cell styling */}
                <span className={user.rank === userPosition ? "text-secondary-2" : ""}> {/* Highlight text if it's the current user */}
                  {renderCell(user, columnKey)} {/* Render cell content */}
                </span>
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default LowerRanksTable;
