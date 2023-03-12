import * as Dialog from "@radix-ui/react-dialog";
import { ArrowCircleDown, ArrowCircleUp, X } from "phosphor-react";
import { Overlay, Content, CloseButton, TransactionTypeButton, TransactionType } from "./style";
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useContextSelector } from "use-context-selector";
import { TransactionContext } from "../../../contexts/TransactionsContext";

const newTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(['income', 'outcome'])
});

type newTransactionFormInputs = z.infer<typeof newTransactionFormSchema>;

export function NewTransactionModal() {

  const createTransaction = useContextSelector(TransactionContext, (context) => {
    return context.createTransaction
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<newTransactionFormInputs>({
    resolver: zodResolver(newTransactionFormSchema)
  })

  async function handleCreateNewTransaction(data: newTransactionFormInputs) {
    const { description, type, category, price } = data;

    await createTransaction({
      description,
      type,
      category,
      price
    });

  }

  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        <Dialog.Title>
          Nova Transação
        </Dialog.Title>

        <CloseButton >
          <X />
        </CloseButton>

        <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <input
            type="text"
            placeholder="Descrição"
            required
            {...register('description')}
          />
          <input
            type="number"
            placeholder="Preço"
            required
            {...register('price', { valueAsNumber: true })}
          />
          <input
            type="text"
            placeholder="Categoria"
            required
            {...register('category')}
          />

          <Controller
            control={control}
            name="type"
            render={({ field }) => {
              console.log(field);

              return (
                <TransactionType
                  onValueChange={field.onChange}
                  value={field.value}
                >

                  <TransactionTypeButton variant="income" value="income">
                    <ArrowCircleDown size={24} />
                    Entrada
                  </TransactionTypeButton>

                  <TransactionTypeButton variant="outcome" value="outcome">
                    <ArrowCircleUp size={24} />
                    Saída
                  </TransactionTypeButton>

                </TransactionType>
              )
            }}
          />


          <button type="submit" disabled={isSubmitting}>
            Cadastrar
          </button>
        </form>


      </Content>

    </Dialog.Portal>
  )
}