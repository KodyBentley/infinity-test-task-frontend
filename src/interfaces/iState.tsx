export default interface State {
    data: Array<{id: number, first_name: string, last_name: string, email: string, date: string, number: number}>;
    amountPerPage: number;
    currentPage: number;
    current: any;
}