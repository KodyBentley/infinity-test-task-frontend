import * as React from 'react';
import DatePicker from 'react-date-picker';
import Tooltip from 'react-tooltip';
import * as Request from 'request';
import { Col, Grid, Row, Table } from 'react-bootstrap';
import Props from './../interfaces/iProp';
import State from './../interfaces/iState';
import './../styles/form.css';

class FormComponent extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        // Initialize state
        this.state = {
            data: [],
            amountPerPage: 10,
            currentPage: 1,
            current: [],
        };

        /**
         * Binding for functions
         */
        this.handleClick = this.handleClick.bind(this);
        this.sort = this.sort.bind(this);
    }

    componentDidMount() {
        /**
         * Send request to backend which is running on port 3001 to get data to display
         * from mongo database hosted on mLab
         */
        Request('http://localhost:3001', (err, res, body) => {
            if (err) {
                console.log('REQUEST ERROR', err);
            } else {
                // Parse data
                let parsed = JSON.parse(body);
                // Set state for data
                this.setState({
                    data: parsed
                });
                // Configure page
                const indexOfLast = this.state.currentPage * this.state.amountPerPage;
                const indexOfFirst = indexOfLast - this.state.amountPerPage;
                const current = this.state.data.slice(indexOfFirst, indexOfLast);
                // Set state for current data to be shown
                this.setState({
                    current: current
                });
            }
        });
    }

    /**
     * Click function for pagination
     * @param event click event for page number
     */
    handleClick(event: React.ChangeEvent<any>) {
        // Configure page
        let indexOfLast = event.target.id * this.state.amountPerPage;
        let indexOfFirst = indexOfLast - this.state.amountPerPage;
        let current = this.state.data.slice(indexOfFirst, indexOfLast);
        // Set state for current page as well as current data to be shown
        this.setState({
            currentPage: Number(event.target.id),
            current: current
        });
    }

    /**
     * Sort function for asc/desc by ID
     * @param data parameter for current data that is rendered to be sorted
     */
    sort(data: Array<{ id: number, first_name: string, last_name: string, email: string, date: string, number: number }>) {
        // Sort data by reversing current array data
        let sorted: Array<{ id: number, first_name: string, last_name: string, email: string, date: string, number: number }> = data.reverse();
        // Set state for new current data order
        this.setState({
            current: sorted
        });
    }

    public render() {

        /**
         * Declaration of page numbers
         * Loop to determine how many numbers to display based on data length and amount to be shown
         */
        const pageNumbers: Array<any> = [];
        for (let i = 1; i <= Math.ceil(this.state.data.length / this.state.amountPerPage); i++) {
            pageNumbers.push(i);
        }

        /**
         * Declaration of page numbers to be rendered
         * Dynamically map array and return li tags to be rendered
         */
        const renderPageNumbers = pageNumbers.map((display, index) => {
            return (
                <li
                    key={index}
                    id={display}
                    onClick={this.handleClick}
                >
                    <a id={display}> {display}</a>
                </li>
            );
        });
        return (
            <div className="component-container">
                <Grid>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <Table className="data-table" responsive={true}>
                                <thead>
                                    <tr id="table-head-row" onClick={() => this.sort(this.state.current)}>
                                        <th data-tip={true} data-for="id">ID<Tooltip id="id" type="info">
                                            <span>ID of entry.</span>
                                        </Tooltip></th>
                                        <th data-tip={true} data-for="firstName">First Name<Tooltip id="firstName" type="info">
                                            <span>First name of entry.</span>
                                        </Tooltip></th>
                                        <th data-tip={true} data-for="lastName">Last Name<Tooltip id="lastName" type="info">
                                            <span>Last name of entry.</span>
                                        </Tooltip></th>
                                        <th data-tip={true} data-for="email">Email<Tooltip id="email" type="info">
                                            <span>Email of entry.</span>
                                        </Tooltip></th>
                                        <th data-tip={true} data-for="amount">Amount<Tooltip id="amount" type="info">
                                            <span>Amount of entry.</span>
                                        </Tooltip></th>
                                        <th data-tip={true} data-for="date">Date<Tooltip id="date" type="info">
                                            <span>Date of entry.</span>
                                        </Tooltip></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.current.map((data, index) => {
                                        return (
                                            <tr className="data-row" key={index}>
                                                <td key={data.id}>{data.id}</td>
                                                <td key={data.first_name}>{data.first_name}</td>
                                                <td key={data.last_name}>{data.last_name}</td>
                                                <td key={data.email}>{data.email}</td>
                                                <td key={data.number}>{data.number.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
                                                <td key={data.date}><DatePicker value={new Date(data.date)} /></td>
                                            </tr>
                                        );
                                    }, this)}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} md={12} sm={12} className="page-number-container">
                            <ul id="page-numbers">
                                {renderPageNumbers}
                            </ul>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default FormComponent;