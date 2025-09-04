import * as React from 'react';
import { AppLayout } from './appShell/AppLayout';

export interface IStockMgProps {
}

export default class StockMg extends React.Component {
  public render(): React.ReactElement<IStockMgProps> {
    return (<AppLayout />);
  }
}