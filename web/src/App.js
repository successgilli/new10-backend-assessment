import axios from "axios";
import styled from "styled-components";

function App() {
    let loans = [];
    const client = axios.create({
        baseURL: "http://localhost:3000/dev",
        timeout: 5000
    });

    // Helper Functions
    const refreshLoans = async () => {
        const { data: latestLoans } = await client.get("/all");

        // update loan list
        loans = latestLoans;
    };

    const handleDisburse = async loanId => {
        await client.get(`/disburse/${loanId}`);

        const { data: latestLoans } = await client.get("/all");

        // update loan list
        loans = latestLoans;
    };

    const handleDelete = async loanId => {
        await client.get(`/delete/${loanId}`);

        const { data: latestLoans } = await client.get("/all");

        // update loan list
        loans = latestLoans;
    };

    // Components
    const FormItem = styled.div`
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 16px;
    `;

    const Table = styled.table`
        width: 100%;
        th {
            background-color: #00c88f;
            padding: 4px;
        }
        tr {
            &:nth-child(odd) {
                background-color: #ededed;
            }
        }
    `;

    const TableCell = styled.td`
        text-align: ${({ textAlign = "left" }) => textAlign};
    `;

    const Form = ({ onSuccess }) => {
        const handleSubmit = async event => {
            event.preventDefault();
            // Get values
            const amount = document.getElementById("amount").value;
            const kvkNumber = document.getElementById("kvk-number").value;

            // create loan
            await client.get(`/create/${amount}`);

            if (onSuccess) onSuccess();
        };

        return (
            <form id="createLoan" style={{ marginBottom: "16px" }}>
                <FormItem>
                    <label for="kvk">KvK Number</label>
                    <input id="kvk-number" type="number" />
                </FormItem>
                <FormItem>
                    <label for="amount">Amount</label>
                    <input id="amount" type="number" />
                </FormItem>
                <input type="submit" onClick={handleSubmit} value="Create" />
            </form>
        );
    };

    return (
        <div
            className="App"
            style={{
                display: "flex",
                justifyContent: "center",
                width: `100%`,
                padding: "100px 16px"
            }}
        >
            <div
                id="container"
                style={{
                    maxWidth: `750px`,
                    width: "100%",
                    padding: "24px",
                    border: "1px solid"
                }}
            >
                <Form onSuccess={refreshLoans} />
                <Table>
                    <thead>
                        <tr>
                            <th>Loan ID</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Disburse</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loans.length ? (
                            <div
                                style={{
                                    display: "block",
                                    width: "100%",
                                    padding: "4px",
                                    textAlign: "center"
                                }}
                            >
                                No Loans Found
                            </div>
                        ) : (
                            loans.map((loan, index) => (
                                <tr
                                    data-testid="loan-item"
                                    data-loan-id={loan.id}
                                    key={index}
                                >
                                    <TableCell>{loan.id}</TableCell>
                                    <TableCell textAlign="right">
                                        {loan.amount}
                                    </TableCell>
                                    <TableCell textAlign="center">
                                        loan.status
                                    </TableCell>
                                    <TableCell textAlign="center">
                                        <button
                                            aria-label="disburse"
                                            onClick={() =>
                                                handleDisburse(loan.id)
                                            }
                                        >
                                            💸
                                        </button>
                                    </TableCell>
                                    <TableCell textAlign="center">
                                        <button
                                            aria-label="delete"
                                            onClick={() =>
                                                handleDelete(loan.id)
                                            }
                                        >
                                            🗑️
                                        </button>
                                    </TableCell>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default App;
