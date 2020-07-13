/** @ssr-ready **/

/**
 * External Dependencies
 */
import PropTypes from 'prop-types';

import React from 'react';
import { isEqual } from 'lodash';
import classNames from 'classnames';
import createReactClass from 'create-react-class';

/**
 * Internal Dependencies
 */
import NavTabs from './tabs';

import NavItem from './item';
import Search from 'components/search';
import './style.scss';

/**
 * Main
 */
const SectionNav = createReactClass( {
	displayName: 'SectionNav',

	propTypes: {
		children: PropTypes.node,
		selectedText: PropTypes.node,
		selectedCount: PropTypes.number,
		hasPinnedItems: PropTypes.bool,
		onMobileNavPanelOpen: PropTypes.func,
	},

	getInitialState: function () {
		return {
			mobileOpen: false,
		};
	},

	getDefaultProps: function () {
		return {
			onMobileNavPanelOpen: () => {},
		};
	},

	UNSAFE_componentWillMount: function () {
		this.checkForSiblingControls( this.props.children );
	},

	UNSAFE_componentWillReceiveProps: function ( nextProps ) {
		if ( isEqual( this.props, nextProps ) ) {
			return;
		}

		this.checkForSiblingControls( nextProps.children );

		if ( ! this.hasSiblingControls ) {
			this.closeMobilePanel();
		}
	},

	render: function () {
		const children = this.getChildren();
		let className;

		if ( ! children ) {
			className = classNames( {
				'dops-section-nav': true,
				'is-empty': true,
			} );

			return (
				<div className={ className }>
					<div className="dops-section-nav__panel">
						<NavItem />
					</div>
				</div>
			);
		}

		className = classNames( {
			'dops-section-nav': true,
			'is-open': this.state.mobileOpen,
			'has-pinned-items': this.hasPinnedSearch || this.props.hasPinnedItems,
		} );

		return (
			<div className={ className }>
				<div
					className="dops-section-nav__mobile-header"
					role="button"
					onClick={ this.toggleMobileOpenState }
					tabIndex={ 0 }
					onKeyUp={ this.toggleMobileOpenState }
				>
					<span className="dops-section-nav__mobile-header-text">{ this.props.selectedText }</span>
				</div>

				<div className="dops-section-nav__panel">{ children }</div>
			</div>
		);
	},

	getChildren: function () {
		return React.Children.map(
			this.props.children,
			function ( child ) {
				const extraProps = {
					hasSiblingControls: this.hasSiblingControls,
					closeSectionNavMobilePanel: this.closeMobilePanel,
				};

				if ( ! child ) {
					return null;
				}

				// Propagate 'selectedText' to NavItem component
				if (
					child.type === NavTabs &&
					! child.props.selectedText &&
					typeof this.props.selectedText === 'string'
				) {
					extraProps.selectedText = this.props.selectedText;
				}

				// Propagate 'selectedCount' to NavItem component
				if ( child.type === NavTabs && this.props.selectedCount ) {
					extraProps.selectedCount = this.props.selectedCount;
				}

				if ( child.type === Search ) {
					if ( child.props.pinned ) {
						this.hasPinnedSearch = true;
					}

					extraProps.onSearch = this.generateOnSearch( child.props.onSearch );
				}

				return React.cloneElement( child, extraProps );
			}.bind( this )
		);
	},

	closeMobilePanel: function () {
		if ( window.innerWidth < 480 && this.state.mobileOpen ) {
			this.setState( {
				mobileOpen: false,
			} );
		}
	},

	toggleMobileOpenState: function () {
		const mobileOpen = ! this.state.mobileOpen;

		this.setState( {
			mobileOpen: mobileOpen,
		} );

		if ( mobileOpen ) {
			this.props.onMobileNavPanelOpen();
		}
	},

	generateOnSearch: function ( existingOnSearch ) {
		return function () {
			existingOnSearch.apply( this, arguments );
			this.closeMobilePanel();
		}.bind( this );
	},

	checkForSiblingControls: function ( children ) {
		this.hasSiblingControls = false;

		React.Children.forEach(
			children,
			function ( child, index ) {
				// Checking for at least 2 controls groups that are not search or null
				if ( index && child && child.type !== Search ) {
					this.hasSiblingControls = true;
				}
			}.bind( this )
		);
	},
} );

export default SectionNav;
