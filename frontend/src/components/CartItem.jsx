import './CartItem.css';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity > 0 && newQuantity <= item.stock) {
            onUpdateQuantity(item.id, newQuantity);
        }
    };

    const subtotal = (item.price * item.quantity).toFixed(2);

    return (
        <div className="cart-item card">
            <div className="cart-item-image">
                <div className="cart-item-placeholder">
                    <span className="cart-icon"></span>
                </div>
            </div>

            <div className="cart-item-info">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-price">₹{item.price} each</p>
                {item.quantity > item.stock && (
                    <p className="text-error text-sm">Only {item.stock} in stock</p>
                )}
            </div>

            <div className="cart-item-controls">
                <div className="quantity-controls">
                    <button
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        className="btn btn-sm btn-secondary"
                        disabled={item.quantity <= 1}
                    >
                        −
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                        className="btn btn-sm btn-secondary"
                        disabled={item.quantity >= item.stock}
                    >
                        +
                    </button>
                </div>

                <div className="cart-item-subtotal">
                    <span className="subtotal-label">Subtotal</span>
                    <span className="subtotal-value">₹{subtotal}</span>
                </div>

                <button onClick={() => onRemove(item.id)} className="btn btn-sm btn-error">
                    Remove
                </button>
            </div>
        </div>
    );
}
