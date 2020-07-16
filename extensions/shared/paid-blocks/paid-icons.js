/**
 * WordPress dependencies
 */
import { Path, SVG, G, Rect } from '@wordpress/components';

/**
 * Internal dependencies
 */
import PaidSymbol from './paid-symbol';

const simplePaymentsPaidIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path fill="none" d="M0 0h24v24H0V0z" />
		<Path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
		<PaidSymbol />
	</SVG>
);

const recurringPaymentsPaidIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
		<Rect x="0" fill="none" width="24" height="24" />
		<G>
			<Path d="M20 4H4c-1.105 0-2 .895-2 2v12c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2zm0 2v2H4V6h16zM4 18v-6h16v6H4zm2-4h7v2H6v-2zm9 0h3v2h-3v-2z" />
		</G>
		<PaidSymbol />
	</SVG>
);

const calendlyPaidIcon = (
	<SVG height="24" viewBox="0 0 23 24" width="23" xmlns="http://www.w3.org/2000/svg">
		<G fill="none" fillRule="evenodd">
			<Rect
				height="20.956522"
				rx="3"
				stroke="#656a74"
				strokeWidth="2"
				width="20.956522"
				x="1"
				y="2.043478"
			/>
			<Rect fill="#656a74" height="4.869565" rx="1" width="2" x="6.565217" />
			<Rect fill="#656a74" height="4.869565" rx="1" width="2" x="14.652174" />
			<Path
				d="m14.6086957 10.0869565c-.6956522-.57971012-1.6231885-.8695652-2.7826087-.8695652-1.7391305 0-3.47826091 1.5652174-3.47826091 3.6521739s1.73913041 3.6521739 3.47826091 3.6521739c1.1594202 0 2.0869565-.3478261 2.7826087-1.0434782"
				stroke="#656a74"
			/>
		</G>
		<PaidSymbol />
	</SVG>
);

const openTablePaidIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 16" fill="none" height="16" width="22">
		<Path
			fill="#555d66"
			d="m1.997 5.982c-.39457-.00039-.7804.11622-1.108699.33511-.328295.21888-.584312.5302-.735674.89459-.15136174.36439-.1912714.76548-.1146819 1.15254.0765899.38707.2662379.74274.5449639 1.02202.278726.27929.634011.46965 1.020921.54702.38692.07732.78809.03826 1.15278-.11238.36469-.15063.67652-.40602.89606-.73387.21954-.32786.33693-.71345.33733-1.10803v-.002c.001-1.1-.89-1.994-1.992-1.995zm12.006 3.988c-.3946.0004-.7805-.11625-1.1088-.33517-.3283-.21893-.5843-.53031-.7357-.89476-.1513-.36444-.1912-.76558-.1145-1.15268s.2664-.74276.5453-1.022c.2788-.27925.6342-.46953 1.0211-.54679.387-.07725.7882-.038 1.1529.11278.3647.15079.6764.40634.8959.73432.2194.32799.3366.71369.3368 1.1083v.003c.0003.52814-.2092 1.03477-.5824 1.4085s-.8795.58397-1.4076.5845zm0-9.96999843c-1.5777-.0009886-3.1203.46588743-4.43262 1.34158843-1.31236.8757-2.33558 2.1209-2.94025 3.57813-.60467 1.45722-.76365 3.06103-.45683 4.60861.30683 1.54757 1.06567 2.96947 2.18058 4.08577 1.1149 1.1163 2.53582 1.8769 4.08302 2.1856 1.5472.3088 3.1512.1518 4.6091-.451 1.458-.6028 2.7045-1.6245 3.5819-2.9358.8773-1.3112 1.3461-2.8532 1.3471-4.4309v-.005c.0008-2.11466-.8384-4.14304-2.3331-5.63899-1.4946-1.495952-3.5222-2.3369478-5.6369-2.33800843z"
		/>
		<PaidSymbol />
	</SVG>
);

export const PAID_ICONS = {
	'jetpack/simple-payments': simplePaymentsPaidIcon,
	'jetpack/recurring-payments': recurringPaymentsPaidIcon,
	'jetpack/calendly': calendlyPaidIcon,
	'jetpack/open-table': openTablePaidIcon,
};

export function hasPaidIcon( name ) {
	return PAID_ICONS.hasOwnProperty( name );
}

export function getPaidIcon( settings, name ) {
	return hasPaidIcon( name ) ? PAID_ICONS[ name ] : settings.icon;
}
