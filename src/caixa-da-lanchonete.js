import { cardapio } from "./db/cardapio";
import { formasDePagamentoETaxa } from "./db/formas-de-pagamento";

class CaixaDaLanchonete {

    calcularValorDaCompra(metodoDePagamento, itens) {
        const identificandoTaxaPagamento = formasDePagamentoETaxa.find(pagamentoeTaxa => {
            return pagamentoeTaxa.tipo === metodoDePagamento
        });

        let temChantily = false;
        let temCafe = false;
        let temQueijo = false;
        let temSanduiche = false;

        if (!identificandoTaxaPagamento) {
            return 'Forma de pagamento inválida!';
        }

        if (itens.length === 0) {
            return 'Não há itens no carrinho de compra!';
        }

        const itensTratados = this.tratarItens(itens);

        const quantidadeInvalida = itensTratados.some(item => item.quantidade === 0);
        const itemInvalido = itensTratados.some(item => item.item === undefined);
        const itemInexistente = itensTratados.some(item => {
            return !cardapio.find(itemCardapio => itemCardapio.codigo === item.item);
        });

        if (quantidadeInvalida) {
            return "Quantidade inválida!"
        }
        if (itemInvalido || itemInexistente) {
            return "Item inválido!"
        }

        let somaDosItens = 0;
        for (let i = 0; i < itensTratados.length; i++) {
            const itemEncontrado = cardapio.find(itemCardapio => {
                return itemCardapio.codigo === itensTratados[i].item
            });
            somaDosItens += itensTratados[i].quantidade * itemEncontrado.valor;

            if (itensTratados[i].item === "cafe") {
                temCafe = true;
            }
            if (itensTratados[i].item === "chantily") {
                temChantily = true;
            }
            if (itensTratados[i].item === "queijo") {
                temQueijo = true;
            }
            if (itensTratados[i].item === "sanduiche") {
                temSanduiche = true;
            }
        }

        if (temChantily && !temCafe || temQueijo && !temSanduiche) {
            return "Item extra não pode ser pedido sem o principal"
        }

        const valorDaCompra = somaDosItens * identificandoTaxaPagamento.taxa;

        return `R$ ${(valorDaCompra.toFixed(2))}`.replace(".", ",");
    }

    tratarItens(itens) {
        return itens.map(item => {
            const itemSeparado = item.split(",")

            return itemSeparado.length === 2 ? {
                item: itemSeparado[0],
                quantidade: Number(itemSeparado[1])
            } : {};
        });
    }

}

export { CaixaDaLanchonete };