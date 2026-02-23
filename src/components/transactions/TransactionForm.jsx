import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createCategory } from '../../store/slices/categorySlice';
import Modal from '../common/Modal';
import './TransactionForm.css';

const today = () => new Date().toISOString().split('T')[0];

const EMPTY_FORM = {
  type:        'expense',
  description: '',
  amount:      '',
  categoryId:  '',
  date:        today(),
  notes:       '',
};

const EMPTY_NEW_CAT = { name: '', icon: '📦', color: '#6366f1' };

const EMOJI_OPTIONS = [
  '🏠','🍔','🚗','🛍️','💊','🎬','⚡','💼','💻','📈',
  '📚','📱','✈️','🎵','🍕','☕','🎮','🏋️','🐾','🎁',
  '🧾','🏥','🎓','💡','🎨','🧳','📦','🌿',
];

const COLOR_OPTIONS = [
  '#6366f1','#3b82f6','#06b6d4','#10b981','#22c55e',
  '#f59e0b','#f97316','#ec4899','#8b5cf6','#ef4444',
];

/**
 * TransactionForm — Add / Edit transaction modal.
 *
 * @param {boolean}  isOpen   — controlled by parent
 * @param {Function} onClose  — close handler
 * @param {object}   initial  — if set, pre-fill for edit mode
 * @param {Array}    categories
 * @param {Function} onCreate  — (formData) => Promise
 * @param {Function} onUpdate  — (id, formData) => Promise
 */
export default function TransactionForm({
  isOpen,
  onClose,
  initial = null,
  categories = [],
  onCreate,
  onUpdate,
}) {
  const isEdit = Boolean(initial);

  const dispatch = useDispatch();

  const [form,    setForm]    = useState(EMPTY_FORM);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr,  setApiErr]  = useState('');

  // Custom category creator state
  const [showNewCat,    setShowNewCat]    = useState(false);
  const [newCat,        setNewCat]        = useState(EMPTY_NEW_CAT);
  const [newCatLoading, setNewCatLoading] = useState(false);
  const [newCatError,   setNewCatError]   = useState('');

  // Populate when editing or reset when modal opens for add
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setApiErr('');
      setLoading(false);
      setShowNewCat(false);
      setNewCat(EMPTY_NEW_CAT);
      setNewCatError('');
      if (initial) {
        setForm({
          type:        initial.type,
          description: initial.description,
          amount:      String(initial.amount),
          categoryId:  initial.categoryId,
          date:        initial.date,
          notes:       initial.notes ?? '',
        });
      } else {
        setForm(EMPTY_FORM);
      }
    }
  }, [isOpen, initial]);

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleCreateCategory = async () => {
    if (!newCat.name.trim()) {
      setNewCatError('Category name is required.');
      return;
    }
    setNewCatLoading(true);
    setNewCatError('');
    try {
      const result = await dispatch(createCategory({
        name:  newCat.name.trim(),
        icon:  newCat.icon,
        color: newCat.color,
      })).unwrap();
      set('categoryId', result.id);
      setShowNewCat(false);
      setNewCat(EMPTY_NEW_CAT);
    } catch {
      setNewCatError('Failed to create category. Try again.');
    } finally {
      setNewCatLoading(false);
    }
  };

  // Filter categories by current type intention
  const filteredCats = categories.filter((c) => {
    // Income categories: Salary, Freelance, Investments
    const incomeCatIds = ['cat_08', 'cat_09', 'cat_10'];
    return form.type === 'income'
      ? incomeCatIds.includes(c.id)
      : !incomeCatIds.includes(c.id);
  });

  const validate = () => {
    const e = {};
    if (!form.description.trim())         e.description = 'Description is required';
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Enter a valid amount greater than 0';
    if (!form.categoryId)                 e.categoryId  = 'Please select a category';
    if (!form.date)                       e.date        = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      type:        form.type,
      description: form.description.trim(),
      amount:      parseFloat(form.amount),
      categoryId:  form.categoryId,
      date:        form.date,
      notes:       form.notes.trim() || undefined,
    };

    setLoading(true);
    setApiErr('');
    try {
      if (isEdit) {
        await onUpdate(initial.id, payload);
      } else {
        await onCreate(payload);
      }
      onClose();
    } catch {
      setApiErr('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Transaction' : 'Add Transaction'}
      size="md"
    >
      <form className="txn-form" onSubmit={handleSubmit} noValidate>

        {/* ── Type selector ── */}
        <div className="txn-form__type-tabs">
          {['expense', 'income'].map((t) => (
            <button
              key={t}
              type="button"
              className={`txn-form__type-btn txn-form__type-btn--${t} ${form.type === t ? 'txn-form__type-btn--active' : ''}`}
              onClick={() => { set('type', t); set('categoryId', ''); }}
            >
              <span className="txn-form__type-icon">{t === 'income' ? '↑' : '↓'}</span>
              {t === 'income' ? 'Income' : 'Expense'}
            </button>
          ))}
        </div>

        {/* ── API error banner ── */}
        {apiErr && <div className="txn-form__api-error">{apiErr}</div>}

        {/* ── Description ── */}
        <div className={`txn-form__field ${errors.description ? 'txn-form__field--error' : ''}`}>
          <label className="txn-form__label" htmlFor="tf-desc">Description</label>
          <input
            id="tf-desc"
            type="text"
            className="txn-form__input"
            placeholder="e.g. Monthly salary"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            disabled={loading}
            autoFocus
          />
          {errors.description && <span className="txn-form__error">{errors.description}</span>}
        </div>

        {/* ── Amount + Date (side by side) ── */}
        <div className="txn-form__row">
          <div className={`txn-form__field ${errors.amount ? 'txn-form__field--error' : ''}`}>
            <label className="txn-form__label" htmlFor="tf-amount">Amount</label>
            <div className="txn-form__input-prefix-wrap">
              <span className="txn-form__prefix">$</span>
              <input
                id="tf-amount"
                type="number"
                className="txn-form__input txn-form__input--prefixed"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
                disabled={loading}
              />
            </div>
            {errors.amount && <span className="txn-form__error">{errors.amount}</span>}
          </div>

          <div className={`txn-form__field ${errors.date ? 'txn-form__field--error' : ''}`}>
            <label className="txn-form__label" htmlFor="tf-date">Date</label>
            <input
              id="tf-date"
              type="date"
              className="txn-form__input"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              disabled={loading}
            />
            {errors.date && <span className="txn-form__error">{errors.date}</span>}
          </div>
        </div>

        {/* ── Category ── */}
        <div className={`txn-form__field ${errors.categoryId ? 'txn-form__field--error' : ''}`}>
          <div className="txn-form__label-row">
            <label className="txn-form__label" htmlFor="tf-cat">Category</label>
            {!showNewCat && (
              <button
                type="button"
                className="txn-form__new-cat-btn"
                onClick={() => setShowNewCat(true)}
              >
                + New category
              </button>
            )}
          </div>
          <select
            id="tf-cat"
            className="txn-form__input"
            value={form.categoryId}
            onChange={(e) => set('categoryId', e.target.value)}
            disabled={loading || showNewCat}
          >
            <option value="">Select a category…</option>
            {filteredCats.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
          {errors.categoryId && <span className="txn-form__error">{errors.categoryId}</span>}

          {/* ── Inline new-category panel ── */}
          {showNewCat && (
            <div className="txn-form__new-cat-panel">
              <p className="txn-form__new-cat-heading">Create custom category</p>

              {/* Name */}
              <input
                type="text"
                className="txn-form__input txn-form__new-cat-name"
                placeholder="Category name…"
                value={newCat.name}
                onChange={(e) => setNewCat((p) => ({ ...p, name: e.target.value }))}
                autoFocus
                disabled={newCatLoading}
                maxLength={30}
              />

              {/* Emoji grid */}
              <p className="txn-form__new-cat-sublabel">Pick an icon</p>
              <div className="txn-form__emoji-grid">
                {EMOJI_OPTIONS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    className={`txn-form__emoji-btn${newCat.icon === em ? ' txn-form__emoji-btn--active' : ''}`}
                    onClick={() => setNewCat((p) => ({ ...p, icon: em }))}
                    disabled={newCatLoading}
                    aria-label={em}
                  >
                    {em}
                  </button>
                ))}
              </div>

              {/* Color swatches */}
              <p className="txn-form__new-cat-sublabel">Pick a color</p>
              <div className="txn-form__color-swatches">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    className={`txn-form__color-swatch${newCat.color === col ? ' txn-form__color-swatch--active' : ''}`}
                    style={{ background: col }}
                    onClick={() => setNewCat((p) => ({ ...p, color: col }))}
                    disabled={newCatLoading}
                    aria-label={col}
                  />
                ))}
              </div>

              {/* Preview */}
              <div className="txn-form__new-cat-preview">
                <span
                  className="txn-form__new-cat-preview-icon"
                  style={{ background: `${newCat.color}22`, borderColor: `${newCat.color}55` }}
                >
                  {newCat.icon}
                </span>
                <span className="txn-form__new-cat-preview-name" style={{ color: newCat.color }}>
                  {newCat.name || 'Category name'}
                </span>
              </div>

              {newCatError && <p className="txn-form__new-cat-error">{newCatError}</p>}

              {/* Actions */}
              <div className="txn-form__new-cat-actions">
                <button
                  type="button"
                  className="txn-form__btn txn-form__btn--cancel txn-form__btn--sm"
                  onClick={() => { setShowNewCat(false); setNewCat(EMPTY_NEW_CAT); setNewCatError(''); }}
                  disabled={newCatLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="txn-form__btn txn-form__btn--create txn-form__btn--sm"
                  onClick={handleCreateCategory}
                  disabled={newCatLoading}
                >
                  {newCatLoading ? 'Creating…' : 'Create & Select'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Notes (optional) ── */}
        <div className="txn-form__field">
          <label className="txn-form__label" htmlFor="tf-notes">
            Notes <span className="txn-form__optional">(optional)</span>
          </label>
          <textarea
            id="tf-notes"
            className="txn-form__input txn-form__textarea"
            placeholder="Add any extra details…"
            rows={2}
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            disabled={loading}
          />
        </div>

        {/* ── Footer actions ── */}
        <div className="txn-form__footer">
          <button
            type="button"
            className="txn-form__btn txn-form__btn--cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`txn-form__btn txn-form__btn--submit txn-form__btn--${form.type}`}
            disabled={loading}
          >
            {loading
              ? (isEdit ? 'Saving…' : 'Adding…')
              : (isEdit ? 'Save Changes' : `Add ${form.type === 'income' ? 'Income' : 'Expense'}`)}
          </button>
        </div>
      </form>
    </Modal>
  );
}
