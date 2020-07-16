/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import UpgradePlanBanner from './upgrade-plan-banner';

export default OriginalBlockEdit => props => {
	return (
		<Fragment>
			<InspectorControls>
				<UpgradePlanBanner description={ null } align={ props?.attributes?.align } />
			</InspectorControls>

			<UpgradePlanBanner title={ null } align={ props?.attributes?.align } />
			<OriginalBlockEdit { ...props } />
		</Fragment>
	);
};
