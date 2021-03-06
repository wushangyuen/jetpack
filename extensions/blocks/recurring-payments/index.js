/**
 * External dependencies
 */
import { Path, Rect, SVG, G } from '@wordpress/components';
import { getCurrencyDefaults } from '@automattic/format-currency';
import { trimEnd } from 'lodash';

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { __, _x } from '@wordpress/i18n';
import deprecatedV1 from './deprecated/v1';
import edit from './edit';
import './editor.scss';

export const name = 'recurring-payments';

export const icon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
		<Rect x="0" fill="none" width="24" height="24" />
		<G>
			<Path d="M20 4H4c-1.105 0-2 .895-2 2v12c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2zm0 2v2H4V6h16zM4 18v-6h16v6H4zm2-4h7v2H6v-2zm9 0h3v2h-3v-2z" />
		</G>
	</SVG>
);

export const settings = {
	title: __( 'Payments', 'jetpack' ),
	icon,
	description: __( 'Button allowing you to sell products and subscriptions.', 'jetpack' ),
	category: 'earn',
	keywords: [
		_x( 'sell', 'block search term', 'jetpack' ),
		_x( 'subscriptions', 'block search term', 'jetpack' ),
		_x( 'product', 'block search term', 'jetpack' ),
		'stripe',
		_x( 'memberships', 'block search term', 'jetpack' ),
	],
	attributes: {
		planId: {
			type: 'integer',
		},
		align: {
			type: 'string',
		},
	},
	edit,
	save: ( { className } ) => (
		<div className={ className }>
			<InnerBlocks.Content />
		</div>
	),
	supports: {
		html: false,
		align: true,
	},
	deprecated: [ deprecatedV1 ],
};

/**
 * Currencies we support and Stripe's minimum amount for a transaction in that currency.
 *
 * @link https://stripe.com/docs/currencies#minimum-and-maximum-charge-amounts
 *
 * List has to be in sync with the Memberships library in WP.com.
 * @see Memberships_Product::SUPPORTED_CURRENCIES
 *
 * @type { [currency: string]: number }
 */
export const SUPPORTED_CURRENCIES = {
	USD: 0.5,
	AUD: 0.5,
	BRL: 0.5,
	CAD: 0.5,
	CHF: 0.5,
	DKK: 2.5,
	EUR: 0.5,
	GBP: 0.3,
	HKD: 4.0,
	INR: 0.5,
	JPY: 50,
	MXN: 10,
	NOK: 3.0,
	NZD: 0.5,
	PLN: 2.0,
	SEK: 3.0,
	SGD: 0.5,
};

/**
 * Compute a list of currency value and display labels.
 *
 * - `value` is the currency's three character code
 * - `label` is the user facing representation.
 *
 * @typedef {{value: string, label: string}} CurrencyDetails
 *
 * @type Array<CurrencyDetails>
 */
export const CURRENCY_OPTIONS = Object.keys( SUPPORTED_CURRENCIES ).map( value => {
	const { symbol } = getCurrencyDefaults( value );
	const label = symbol === value ? value : `${ value } ${ trimEnd( symbol, '.' ) }`;
	return { value, label };
} );

/**
 * Returns the minimum transaction amount for the given currency. If currency is not one of the
 * known types it returns ...
 *
 * @param {string} currency_code three character currency code to get minimum charge for
 * @return {number} Minimum charge amount for the given currency_code
 */
export function minimumTransactionAmountForCurrency( currency_code ) {
	const minimum = SUPPORTED_CURRENCIES[ currency_code ];
	return minimum;
}

/**
 * True if the price is a number and at least the minimum allowed amount.
 *
 * @param {string} currency Currency for the given price.
 * @param {number} price Price to check.
 * @return {boolean} true if valid price
 */
export function isPriceValid( currency, price ) {
	return ! isNaN( price ) && price >= minimumTransactionAmountForCurrency( currency );
}

/**
 * Removes products with prices below their minimums.
 *
 * TS compatible typedef, but JSDoc lint doesn't like it.
 * typedef {{
 *   buyer_can_change_amount: ?boolean
 *   connected_account_product_id: string
 *   connected_destination_account_id: string
 *   currency: string
 *   description: string
 *   id: number
 *   interval: string
 *   multiple_per_user: ?boolean
 *   price: string
 *   site_id: string
 *   title: string
 * }} Product
 *
 * @param {Array<Product>} products List of membership products.
 * @return {Array<Product>} List of producits with invalid products removed.
 */
export function removeInvalidProducts( products ) {
	return products.filter( product => isPriceValid( product.currency, product.price ) );
}
