import { createContext, useState, useEffect, ReactNode } from "react";

interface Transaction {
  id: number;
  description: string;
  type: 'income' | 'outcome';
  price: number;
  category: string;
  createdAt: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  fetchTransactions: (query?: string) => Promise<void>;
}

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionProviderProps) {

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  //Sintaxe async/await utilizada, fora do useEffect, para simplificar o código 
  //escrito no formato de promise (.then). O useEffect não aceita funções assíncronas

  async function fetchTransactions(query?: string) {

    const url = new URL("http://localhost:3000/transactions");

    if (query) {
      url.searchParams.append("q", query);
    }

    const response = await fetch(url);
    const data = await response.json();

    setTransactions(data);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);


  return (
    <TransactionContext.Provider value={{
      transactions,
      fetchTransactions
    }}>
      {children}
    </TransactionContext.Provider>
  )
}