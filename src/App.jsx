import { useState } from 'react'
import './App.css'

const initialProducts = [
  {
    id: 1,
    name: 'Chocolate Cake',
    category: 'Cakes',
    price: 129.99,
    quantity: 1,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
    description:
      'Rich chocolate cake layered with smooth ganache and topped with a glossy finish.',
    specification:
      'Soft sponge, dark chocolate, creamy ganache, perfect for celebrations',
  },
  {
    id: 2,
    name: 'Strawberry Shortcake',
    category: 'Desserts',
    price: 79.5,
    quantity: 2,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
    description:
      'A light and fluffy dessert with fresh strawberries and creamy whipped filling.',
    specification:
      'Fresh berries, whipped cream, vanilla sponge, sweet and airy texture',
  },
  {
    id: 3,
    name: 'Cheesecake',
    category: 'Specialty',
    price: 89.0,
    quantity: 3,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1533134242443-d6adb086fad1?auto=format&fit=crop&w=900&q=80',
    description:
      'Creamy cheesecake with a smooth texture and a delicate balance of sweetness.',
    specification:
      'Cream cheese base, buttery crust, silky filling, best served chilled',
  },
]

const emptyForm = {
  image: '',
  name: '',
  category: '',
  description: '',
  specification: '',
  price: '',
  rating: '',
  quantity: '',
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value)
}

function App() {
  const [products, setProducts] = useState(initialProducts)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProductId, setSelectedProductId] = useState(initialProducts[0].id)
  const [cartItems, setCartItems] = useState([])
  const [page, setPage] = useState('products')
  const [formData, setFormData] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  const categories = ['All', ...new Set(products.map((product) => product.category))]

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? filteredProducts[0] ?? null

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartProducts = cartItems
    .map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.productId),
    }))
    .filter((item) => Boolean(item.product))
  const cartTotal = cartProducts.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )

  const handleQuantityChange = (productId, change) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: Math.max(0, product.quantity + change) }
          : product,
      ),
    )
  }

  const handleAddToCart = (productId) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === productId)

      return existingItem
        ? currentItems.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...currentItems, { productId, quantity: 1 }]
    })
  }

  const handleCartQuantityChange = (productId, change) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}
    Object.entries(formData).forEach(([key, value]) => {
      if (!String(value).trim()) {
        nextErrors[key] = 'This field is required.'
      }
    })

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setSuccessMessage('')
      return
    }

    const newProduct = {
      id: Date.now(),
      name: formData.name.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      specification: formData.specification.trim(),
      image: formData.image.trim(),
      rating: Number(formData.rating),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    }

    setProducts((currentProducts) => [newProduct, ...currentProducts])
    setSelectedCategory('All')
    setSelectedProductId(newProduct.id)
    setFormData(emptyForm)
    setErrors({})
    setSuccessMessage(`${newProduct.name} was successfully added to the inventory.`)
    setPage('products')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Jersey's Cake Shop</h1>
        </div>
        <div className="topbar-actions">
          <button
            type="button"
            className="toggle-form-button"
            onClick={() => setPage('add')}
          >
            Add New Cake
          </button>
          <button
            type="button"
            className="cart-pill cart-button"
            aria-pressed={page === 'cart'}
            onClick={() => setPage(page === 'cart' ? 'products' : 'cart')}
          >
            Cart {cartCount}
          </button>
        </div>
      </header>

      {page === 'cart' ? (
        <main className="cart-page">
          <div className="section-header">
            <h2>Your Cart</h2>
            <button
              type="button"
              className="toggle-form-button"
              onClick={() => setPage('products')}
            >
              Back to products
            </button>
          </div>
          {cartProducts.length === 0 ? (
            <p className="empty-cart">Your cart is empty. Add products to see them here.</p>
          ) : (
            <>
              <div className="cart-items">
                {cartProducts.map(({ product, quantity }) => (
                  <article className="cart-item" key={product.id}>
                    <img src={product.image} alt={product.name} />
                    <div className="cart-item-info">
                      <span className="product-category">{product.category}</span>
                      <h3>{product.name}</h3>
                      <p>{formatCurrency(product.price)} each</p>
                    </div>
                    <div className="quantity-row cart-quantity">
                      <button
                        type="button"
                        aria-label={`Remove one ${product.name} from cart`}
                        onClick={() => handleCartQuantityChange(product.id, -1)}
                      >
                        −
                      </button>
                      <span>{quantity}</span>
                      <button
                        type="button"
                        aria-label={`Add one ${product.name} to cart`}
                        onClick={() => handleCartQuantityChange(product.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <strong>{formatCurrency(product.price * quantity)}</strong>
                  </article>
                ))}
              </div>
              <div className="cart-total">
                <span>Cart total</span>
                <strong>{formatCurrency(cartTotal)}</strong>
              </div>
            </>
          )}
        </main>
      ) : page === 'add' ? (
        <main className="add-product-page">
          <div className="section-header">
            <h2>Add New Cake</h2>
            <button
              type="button"
              className="toggle-form-button"
              onClick={() => setPage('products')}
            >
              Back to products
            </button>
          </div>
          <form className="product-form" onSubmit={handleSubmit} noValidate>
            <label>
              Feature Image
              <input
                type="url"
                name="image"
                value={formData.image}
                placeholder="https://example.com/product.jpg"
                onChange={handleFieldChange}
              />
              {errors.image && <span className="field-error">{errors.image}</span>}
            </label>
            <label>
              Product Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFieldChange}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>
            <label>
              Category
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleFieldChange}
              />
              {errors.category && <span className="field-error">{errors.category}</span>}
            </label>
            <label>
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFieldChange}
              />
              {errors.description && <span className="field-error">{errors.description}</span>}
            </label>
            <label>
              Product specification
              <textarea
                name="specification"
                value={formData.specification}
                onChange={handleFieldChange}
              />
              {errors.specification && (
                <span className="field-error">{errors.specification}</span>
              )}
            </label>
            <div className="two-column-fields">
              <label>
                Rating
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="rating"
                  value={formData.rating}
                  onChange={handleFieldChange}
                />
                {errors.rating && <span className="field-error">{errors.rating}</span>}
              </label>
              <label>
                Quantity
                <input
                  type="number"
                  min="1"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleFieldChange}
                />
                {errors.quantity && <span className="field-error">{errors.quantity}</span>}
              </label>
            </div>
            <label>
              Price
              <input
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleFieldChange}
              />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </label>
            {successMessage && <p className="success-message">{successMessage}</p>}
            <button type="submit" className="submit-button">
              Add Product
            </button>
          </form>
        </main>
      ) : (
      <main className="content-layout">
        <section className="catalog-section">
          <div className="section-header">
            <h2>Cakes</h2>
            <label className="filter-box">
              <span>Category</span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className={`product-card ${selectedProduct?.id === product.id ? 'selected' : ''}`}
              >
                <button
                  type="button"
                  className="image-button"
                  onClick={() => setSelectedProductId(product.id)}
                  aria-label={`View ${product.name}`}
                >
                  <img src={product.image} alt={product.name} />
                </button>

                <div className="product-body">
                  <div className="product-header-row">
                    <span className="product-category">{product.category}</span>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => setSelectedProductId(product.id)}
                    >
                      Details
                    </button>
                  </div>

                  <h3>{product.name}</h3>
                  <p className="product-price">{formatCurrency(product.price)}</p>
                  <div className="meta-row">
                    <span>Rating: {product.rating}</span>
                    <span>Qty: {product.quantity}</span>
                  </div>

                  <div className="quantity-row">
                    <button type="button" onClick={() => handleQuantityChange(product.id, -1)}>
                      −
                    </button>
                    <span>{product.quantity}</span>
                    <button type="button" onClick={() => handleQuantityChange(product.id, 1)}>
                      +
                    </button>
                  </div>

                  <div className="card-footer">
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Add to cart
                    </button>
                    <p className="subtotal">Subtotal {formatCurrency(product.price * product.quantity)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="sidebar">
          <section className="detail-card">
            {selectedProduct ? (
              <>
                <img src={selectedProduct.image} alt={selectedProduct.name} />
                <div className="detail-content">
                  <span className="detail-category">{selectedProduct.category}</span>
                  <h3>{selectedProduct.name}</h3>
                  <p className="detail-rating">⭐ {selectedProduct.rating}</p>
                  <p className="detail-description">{selectedProduct.description}</p>
                  <div className="detail-meta">
                    <span>Price: {formatCurrency(selectedProduct.price)}</span>
                    <span>Stock: {selectedProduct.quantity}</span>
                  </div>
                  <div className="detail-specs">
                    <h4>Specification</h4>
                    <p>{selectedProduct.specification}</p>
                  </div>
                </div>
              </>
            ) : (
              <p>No product selected.</p>
            )}
          </section>

        </aside>
      </main>
      )}
    </div>
  )
}

export default App
