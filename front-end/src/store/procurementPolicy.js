/**
 * ============================================================
 * Procurement policy — pure rules, no state
 * ============================================================
 * Everything here is a pure function so the workflow rules can be
 * unit / end-to-end tested without React or the store.
 *
 *  1. Item classification rules — a laptop can only ever be raised
 *     under Equipment & Assets → Laptop, and the same guard applies
 *     to every other well-known item type.
 *  2. Department routing — which team owns a category and is therefore
 *     allowed to select the vendor and process the purchase order.
 *  3. Purchase order state machine.
 */

// ── 1. Item classification ───────────────────────────────────
/**
 * Keyword → mandatory (category, subcategory) pairs.
 * The first rule whose keyword appears in the item title wins.
 */
export const ITEM_CATEGORY_RULES = [
  { key: 'laptop', keywords: ['laptop', 'macbook', 'notebook pc', 'thinkpad', 'ideapad', 'ultrabook', 'chromebook'], category: 'Equipment & Assets', subcategory: 'Laptop' },
  { key: 'desktop', keywords: ['desktop', 'workstation', 'all-in-one pc', 'tower pc', 'imac'], category: 'Equipment & Assets', subcategory: 'Desktop' },
  { key: 'monitor', keywords: ['monitor', 'ultrasharp', 'display panel'], category: 'Equipment & Assets', subcategory: 'Monitor' },
  { key: 'keyboard', keywords: ['keyboard'], category: 'Equipment & Assets', subcategory: 'Keyboard' },
  { key: 'mouse', keywords: ['mouse', 'trackpad'], category: 'Equipment & Assets', subcategory: 'Mouse' },
  { key: 'headset', keywords: ['headset', 'headphone', 'earphone'], category: 'Equipment & Assets', subcategory: 'Headset' },
  { key: 'webcam', keywords: ['webcam'], category: 'Equipment & Assets', subcategory: 'Webcam' },
  { key: 'dock', keywords: ['docking station', 'dock hub'], category: 'Equipment & Assets', subcategory: 'Docking Station' },
  { key: 'license', keywords: ['license', 'licence'], category: 'Software & Digital Services', subcategory: 'Software License' },
  { key: 'saas', keywords: ['subscription', 'saas'], category: 'Software & Digital Services', subcategory: 'SaaS Subscription' },
  { key: 'cloud', keywords: ['cloud credits', 'cloud service', 'aws ', 'azure', 'gcp'], category: 'Software & Digital Services', subcategory: 'Cloud Service' },
  { key: 'furniture', keywords: ['chair', 'desk', 'table', 'furniture', 'cabinet', 'workbench'], category: 'Facilities', subcategory: 'Furniture' },
  { key: 'renovation', keywords: ['renovation', 'remodel', 'civil work', 'interior work'], category: 'Facilities', subcategory: 'Renovation' },
  { key: 'repairs', keywords: ['repair', 'servicing', 'maintenance visit'], category: 'Facilities', subcategory: 'Repairs' },
  { key: 'cleaning', keywords: ['cleaning', 'housekeeping', 'sanitiser', 'sanitizer'], category: 'Facilities', subcategory: 'Cleaning Supplies' },
];

const normalise = (value) => ` ${String(value || '').toLowerCase()} `;

/** The classification rule an item title falls under, or null. */
export const classifyItem = (title) => {
  const haystack = normalise(title);
  return ITEM_CATEGORY_RULES.find((rule) => rule.keywords.some((k) => haystack.includes(k))) || null;
};

/**
 * Validate the category/subcategory chosen for an item.
 * Returns null when valid, otherwise a human readable message.
 * A laptop request, for instance, can only be filed under
 * Equipment & Assets → Laptop.
 */
export const validateItemCategory = ({ title, category, subcategory }) => {
  const rule = classifyItem(title);
  if (!rule) return null;
  if (category !== rule.category || subcategory !== rule.subcategory) {
    return `"${String(title).trim()}" is a ${rule.subcategory.toLowerCase()} item. It must be raised under ${rule.category} → ${rule.subcategory} (selected: ${category || '—'} → ${subcategory || '—'}).`;
  }
  return null;
};

/** Suggested category/subcategory for a title, for inline hints in the UI. */
export const suggestCategory = (title) => {
  const rule = classifyItem(title);
  return rule ? { category: rule.category, subcategory: rule.subcategory } : null;
};

// ── 2. Department routing ────────────────────────────────────
/** Which department team owns each procurement category. */
export const CATEGORY_TEAMS = {
  'Equipment & Assets': 'equipment_team',
  'Software & Digital Services': 'software_team',
  Facilities: 'facilities_team',
};

export const TEAM_LABELS = {
  equipment_team: 'Equipment Team',
  software_team: 'IT / Software Team',
  facilities_team: 'Facilities Team',
  procurement_officer: 'Central Procurement',
  admin: 'Administrator',
};

export const TEAM_DEPARTMENTS = {
  equipment_team: 'Procurement',
  software_team: 'IT',
  facilities_team: 'Facilities',
};

export const DEPARTMENT_TEAM_ROLES = ['equipment_team', 'software_team', 'facilities_team'];
export const CENTRAL_ROLES = ['procurement_officer', 'admin'];

export const teamForCategory = (category) => CATEGORY_TEAMS[category] || 'procurement_officer';

/**
 * Can this role source / award / process work in a category?
 * Central procurement handles everything; a department team only
 * handles the category it is designated for (IT → software,
 * Facilities → facilities, Equipment → equipment).
 */
export const canProcessCategory = (role, category) =>
  CENTRAL_ROLES.includes(role) || teamForCategory(category) === role;

export const assertCanProcessCategory = (role, category) => {
  if (!canProcessCategory(role, category)) {
    throw new Error(
      `Your team is not designated for ${category}. ${TEAM_LABELS[teamForCategory(category)]} or central procurement must process it.`,
    );
  }
};

// ── 3. Purchase order state machine ─────────────────────────
/**
 * A purchase order is raised on vendor award and first goes to finance
 * for approval. Finance approval hands it back to the procurement
 * officer (or the designated department team), who issues it to the
 * supplier for further processing.
 */
export const PO_FLOW = {
  draft: ['pending_finance', 'cancelled'],
  pending_finance: ['finance_approved', 'finance_rejected', 'cancelled'],
  finance_rejected: ['pending_finance', 'cancelled'],
  finance_approved: ['sent', 'cancelled'],
  sent: ['accepted', 'cancelled'],
  accepted: ['in_transit', 'cancelled'],
  in_transit: ['delivered'],
  delivered: ['closed'],
  closed: [],
  cancelled: [],
};

export const PO_ACTION_LABELS = {
  pending_finance: 'Send to Finance for Approval',
  finance_approved: 'Approve Purchase Order (Finance)',
  finance_rejected: 'Reject Purchase Order (Finance)',
  sent: 'Issue to Supplier',
  accepted: 'Record Supplier Acknowledgement',
  in_transit: 'Mark Dispatched',
  delivered: 'Mark Delivered',
  closed: 'Close Order',
  cancelled: 'Cancel Order',
};

export const PO_STAGE_ORDER = [
  'draft',
  'pending_finance',
  'finance_approved',
  'sent',
  'accepted',
  'in_transit',
  'delivered',
  'closed',
];

/**
 * Which roles may drive a PO into a given status. Finance owns the
 * approval gate; procurement (central or the designated department team)
 * owns everything else, including issuing the approved order to the
 * supplier.
 */
export const PO_TRANSITION_ROLES = {
  pending_finance: ['procurement_officer', 'equipment_team', 'software_team', 'facilities_team', 'admin'],
  finance_approved: ['finance_officer', 'admin'],
  finance_rejected: ['finance_officer', 'admin'],
  sent: ['procurement_officer', 'equipment_team', 'software_team', 'facilities_team', 'admin'],
};

/** Finance-only stages: procurement can view but not move them. */
export const FINANCE_PO_STATUSES = ['pending_finance'];

export const rolesForPoTransition = (to) => PO_TRANSITION_ROLES[to] || null;

/** Does this role own the given PO transition? */
export const canRoleTransitionPo = (role, to) => {
  const allowed = rolesForPoTransition(to);
  return !allowed || allowed.includes(role);
};

export const nextPoStatuses = (status) => PO_FLOW[status] || [];

export const canTransitionPo = (from, to) => nextPoStatuses(from).includes(to);

