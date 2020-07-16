/**
 * External dependencies
 */
import { Circle } from '@wordpress/components';

export default ( { cx = 19.5, cy = 4.5, r = 4.5, fill = '#ffb800' } ) => {
	return <Circle cx={ cx } cy={ cy } r={ r } fill={ fill } />;
};
