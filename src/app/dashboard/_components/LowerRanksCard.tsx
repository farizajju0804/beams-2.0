import React from 'react';
import { Table, Avatar, TableHeader, TableBody, TableRow, TableCell, TableColumn } from "@nextui-org/react";

interface LowerRanksTableProps {
  users: any[];
  userPosition: number | undefined;
}

const LowerRanksTable: React.FC<LowerRanksTableProps> = ({ users, userPosition }) => {
  const lowerRankedUsers = users.slice(3, 10);

  const columns = [
    { key: "rank", label: "RANK" },
    { key: "user", label: "NAME" },
    { key: "points", label: "POINTS" },
  ];

  const renderCell = (user: any, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof typeof user];

    switch (columnKey) {
      case "rank":
        return (
          <div
            className={`flex justify-center items-center `}
          >
            <span className="text-sm text-text font-bold">{user.rank}</span>
          </div>
        );
      case "user":
        return (
          <div className="flex items-center">
            <Avatar
              src={user?.user?.image || undefined}
              showFallback
              alt="profile"
              className="w-8 h-8 mr-2 flex-shrink-0"
            />
            <span className='text-wrap flex-grow font-medium text-sm md:text-base'>{`${user.user?.firstName} ${user.user?.lastName} ${user.rank === userPosition ? '(You)' : ''}`}</span>
          </div>
        );
      case "points":
        return <span className='text-wrap mx-auto font-medium text-text text-sm'>{user.points}</span>;
      default:
        return cellValue;
    }
  };

  return (
    <Table
      aria-label="Lower Ranks Table"
      className="max-w-2xl mx-auto px-0 mt-10"
      selectionMode="none"
      classNames={{
        wrapper : "p-0",
        th : 'rounded-0'
      }}
    >
      <TableHeader  columns={columns}>
        {(column) => (
          <TableColumn 
            key={column.key}
            align={column.key === "rank" ? "center" : column.key === "points" ? "end" : "start"}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={lowerRankedUsers}>
        {(user) => (
          <TableRow 
            key={user.id}
            className={`my-2 ${user.rank === userPosition ? "font-bold  font-poppins" : ""}`}
          >
            {(columnKey) => (
              <TableCell className={`py-4 ${columnKey === "points" ? "text-center" : ""}`}>
                <span className={user.rank === userPosition ? "text-secondary-2" : ""}>
                  {renderCell(user, columnKey)}
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