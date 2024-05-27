import React from 'react';
import { Table, Pagination } from 'rsuite';
import { Ticket } from '../../typings/AdminHome';

const { Column, HeaderCell, Cell } = Table;

interface TicketTableProps {
    tickets: Ticket[];
    formatDate: (dateString: string) => string;
    currentPage: number;
    totalPages: number;
    limit: number;
    handlePaginationChange: (dataKey: number) => void;
}

const TicketTable: React.FC<TicketTableProps> = ({
    tickets,
    formatDate,
    currentPage,
    totalPages,
    limit,
    handlePaginationChange
}) => {
    return (
        <div className="m-5 mb-10">
            <Table
                height={400}
                data={tickets}
                virtualized={true}
                wordWrap={false}
                style={{ margin: '10px' }}
            >
                <Column width={100} align="center">
                    <HeaderCell>Serial Number</HeaderCell>
                    <Cell>
                        {(_rowData, index) => (
                            <span>{(currentPage - 1) * limit + index + 1}</span>
                        )}
                    </Cell>
                </Column>
                <Column flexGrow={1} align="center">
                    <HeaderCell>Ticket Key</HeaderCell>
                    <Cell dataKey="key" />
                </Column>
                <Column flexGrow={1} align="center">
                    <HeaderCell>Type</HeaderCell>
                    <Cell dataKey="type" />
                </Column>
                <Column flexGrow={1} align="center">
                    <HeaderCell>Reporter</HeaderCell>
                    <Cell dataKey="reporter" />
                </Column>
                <Column flexGrow={1} align="center">
                    <HeaderCell>Assignee</HeaderCell>
                    <Cell dataKey="assignee" />
                </Column>
                <Column flexGrow={1} align="center">
                    <HeaderCell>Summary</HeaderCell>
                    <Cell dataKey="summary" />
                </Column>
                <Column flexGrow={1} align="center">
                    <HeaderCell>Due Date</HeaderCell>
                    <Cell>{rowData => formatDate(rowData.dueDate)}</Cell>
                </Column>
                <Column flexGrow={1} align="center">
                    <HeaderCell>Status</HeaderCell>
                    <Cell>
                        {rowData => (
                            <span className={`${rowData.status === 'TOBEPICKED' ? 'text-red-500' : rowData.status === 'INPROGRESS' ? 'text-yellow-500' : rowData.status === 'INTESTING' ? 'text-blue-500' : 'text-green-500'}`}>
                                {rowData.status && rowData.status === 'TOBEPICKED' ? 'To be picked' : rowData.status === 'INPROGRESS' ? 'In Progress' : rowData.status === 'INTESTING' ? 'In Testing' : 'Completed'}
                            </span>
                        )}
                    </Cell>
                </Column>
            </Table>
            <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                maxButtons={5}
                size="md"
                layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                total={totalPages * limit} // Correct total calculation
                limitOptions={[10, 20]}
                limit={limit}
                activePage={currentPage}
                onChangePage={(page: number) => handlePaginationChange(page)}
                onChangeLimit={(dataKey: number) => handlePaginationChange(dataKey)}/>
        </div>
    );
};

export default TicketTable;
