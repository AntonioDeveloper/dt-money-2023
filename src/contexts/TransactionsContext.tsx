import { useState, useEffect, ReactNode, useCallback } from "react";
import { createContext } from "use-context-selector";
import { api } from "../lib/axios";

interface Transaction {
  id: number;
  description: string;
  type: 'income' | 'outcome';
  price: number;
  category: string;
  createdAt: string;
}

interface CreateTransactionInput {
  description: string;
  price: number;
  category: string;
  type: 'income' | 'outcome';
}

interface TransactionContextType {
  transactions: Transaction[];
  fetchTransactions: (query?: string) => Promise<void>;
  createTransaction: (data: CreateTransactionInput) => Promise<void>;
}

interface TransactionProviderProps {
  children: ReactNode;
}


export const TransactionContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionProviderProps) {

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  //Sintaxe async/await utilizada, fora do useEffect, para simplificar o código 
  //escrito no formato de promise (.then). O useEffect não aceita funções assíncronas

  const fetchTransactions = useCallback(
    async (query?: string) => {

      const response = await api.get('transactions', {
        params: {
          _sort: 'createdAt',
          _order: "desc",
          q: query,
        }
      })

      setTransactions(response.data);
    },
    []
  );

  const createTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      const { description, type, category, price } = data;

      const response = await api.post('transactions', {
        description,
        type,
        category,
        price,
        createdAt: new Date()
      });

      setTransactions(state => [response.data, ...state]);
    },
    [],
  );



  useEffect(() => {
    fetchTransactions();
  }, []);


  return (
    <TransactionContext.Provider value={{
      transactions,
      fetchTransactions,
      createTransaction
    }}>
      {children}
    </TransactionContext.Provider>
  )
}