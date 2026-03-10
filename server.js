const express = require("express");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());

function mapOrder(body) {
    return {
        orderId: body.numeroPedido.split("-")[0],
        value: body.valorTotal,
        creationDate: new Date(body.dataCriacao),
        items: body.items.map((item) => ({
            productId: Number(item.idItem),
            quantity: item.quantidadeItem,
            price: item.valorItem
        }))
    };
}

function validateOrder(body) {
    if (!body.numeroPedido || !body.valorTotal || !body.dataCriacao || !body.items) {
        return "Campos obrigatórios: numeroPedido, valorTotal, dataCriacao e items.";
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
        return "O campo items deve ser um array com pelo menos um item.";
    }

    for (const item of body.items) {
        if (!item.idItem || item.quantidadeItem == null || item.valorItem == null) {
            return "Cada item deve ter idItem, quantidadeItem e valorItem.";
        }
    }

    return null;
}

app.get("/", (req, res) => {
    res.send("API de pedidos funcionando!");
});

app.post("/order", async (req, res) => {
    const error = validateOrder(req.body);

    if (error) {
        return res.status(400).json({ message: error });
    }

    const mappedOrder = mapOrder(req.body);

    try {
        const [existingOrder] = await db.execute(
            "SELECT orderId FROM orders WHERE orderId = ?",
            [mappedOrder.orderId]
        );

        if (existingOrder.length > 0) {
            return res.status(409).json({ message: "Pedido já cadastrado." });
        }

        await db.execute(
            "INSERT INTO orders (orderId, value, creationDate) VALUES (?, ?, ?)",
            [mappedOrder.orderId, mappedOrder.value, mappedOrder.creationDate]
        );

        for (const item of mappedOrder.items) {
            await db.execute(
                "INSERT INTO items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)",
                [mappedOrder.orderId, item.productId, item.quantity, item.price]
            );
        }

        return res.status(201).json({
            message: "Pedido criado com sucesso.",
            data: mappedOrder
        });
    } catch (err) {
        return res.status(500).json({
            message: "Erro ao salvar pedido no banco.",
            error: err.message
        });
    }
});

app.get("/order/list", async (req, res) => {
    try {
        const [orders] = await db.execute("SELECT * FROM orders");

        for (const order of orders) {
            const [items] = await db.execute(
                "SELECT productId, quantity, price FROM items WHERE orderId = ?",
                [order.orderId]
            );
            order.items = items;
        }

        return res.status(200).json({
            message: "Lista de pedidos.",
            data: orders
        });
    } catch (err) {
        return res.status(500).json({
            message: "Erro ao buscar pedidos.",
            error: err.message
        });
    }
});

app.get("/order/:orderId", async (req, res) => {
    const { orderId } = req.params;

    try {
        const [orders] = await db.execute(
            "SELECT * FROM orders WHERE orderId = ?",
            [orderId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: "Pedido não encontrado." });
        }

        const [items] = await db.execute(
            "SELECT productId, quantity, price FROM items WHERE orderId = ?",
            [orderId]
        );

        const order = orders[0];
        order.items = items;

        return res.status(200).json({
            message: "Pedido encontrado.",
            data: order
        });
    } catch (err) {
        return res.status(500).json({
            message: "Erro ao buscar pedido.",
            error: err.message
        });
    }
});

app.put("/order/:orderId", async (req, res) => {
    const { orderId } = req.params;
    const error = validateOrder(req.body);

    if (error) {
        return res.status(400).json({ message: error });
    }

    const mappedOrder = mapOrder(req.body);
    mappedOrder.orderId = orderId;

    try {
        const [orders] = await db.execute(
            "SELECT orderId FROM orders WHERE orderId = ?",
            [orderId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: "Pedido não encontrado para atualização." });
        }

        await db.execute(
            "UPDATE orders SET value = ?, creationDate = ? WHERE orderId = ?",
            [mappedOrder.value, mappedOrder.creationDate, orderId]
        );

        await db.execute("DELETE FROM items WHERE orderId = ?", [orderId]);

        for (const item of mappedOrder.items) {
            await db.execute(
                "INSERT INTO items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)",
                [orderId, item.productId, item.quantity, item.price]
            );
        }

        return res.status(200).json({
            message: "Pedido atualizado com sucesso.",
            data: mappedOrder
        });
    } catch (err) {
        return res.status(500).json({
            message: "Erro ao atualizar pedido.",
            error: err.message
        });
    }
});

app.delete("/order/:orderId", async (req, res) => {
    const { orderId } = req.params;

    try {
        const [orders] = await db.execute(
            "SELECT orderId FROM orders WHERE orderId = ?",
            [orderId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: "Pedido não encontrado para exclusão." });
        }

        await db.execute("DELETE FROM items WHERE orderId = ?", [orderId]);
        await db.execute("DELETE FROM orders WHERE orderId = ?", [orderId]);

        return res.status(200).json({
            message: "Pedido deletado com sucesso."
        });
    } catch (err) {
        return res.status(500).json({
            message: "Erro ao deletar pedido.",
            error: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});