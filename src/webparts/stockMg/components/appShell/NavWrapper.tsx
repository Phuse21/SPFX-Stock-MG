
import * as React from "react";
import NavigationStore from "../layout/navigationStore"
import { CustomerListPage } from "../pages/customers/CustomerListPage";
import { StockListPage } from "../pages/stock/StockListPage";
import Sidebar from "./Sidebar";
import { OdersListPage } from "../pages/orders/OrdersListPage";


export const NavWrapper: React.FC = () => {
    const {reset} = NavigationStore.useStoreActions(actions => actions);

    const handleNavigate = React.useCallback((page: string) => {
        switch (page) {
            case 'home':
                reset({ key: 'home', component: <StockListPage />, title: 'Stock' });
                break;
            case 'customers':
                reset({ key: 'customers', component: <CustomerListPage />, title: 'Customers' });
                break;
            case 'orders':
                reset({ key: 'orders', component: <OdersListPage />, title: 'Orders' });
                break;
        }
    }, []);

    return <Sidebar onPageSelected={handleNavigate} />
}