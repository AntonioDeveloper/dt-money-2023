import * as Dialog from "@radix-ui/react-dialog";
import { Overlay, Content } from "./style";

export function NewTransactionModal() {
  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        <Dialog.Title>
          Nova Transação
        </Dialog.Title>

        <form>
          <input type="text" placeholder="Descrição" required />
          <input type="number" placeholder="Preço" required />
          <input type="text" placeholder="Categoria" required />

          <button type="submit">
            Cadastrar
          </button>
        </form>

        <Dialog.Close />
      </Content>

    </Dialog.Portal>
  )
}