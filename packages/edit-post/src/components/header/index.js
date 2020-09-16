/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { PostSavedState, PostPreviewButton } from '@wordpress/editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { cog } from '@wordpress/icons';
import {
	PinnedItems,
	__experimentalMainDashboardButton as MainDashboardButton,
} from '@wordpress/interface';
import { useViewportMatch } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import FullscreenModeClose from './fullscreen-mode-close';
import HeaderToolbar from './header-toolbar';
import MoreMenu from './more-menu';
import PostPublishButtonOrToggle from './post-publish-button-or-toggle';
import { default as DevicePreview } from '../device-preview';
import { __, sprintf } from '@wordpress/i18n';

function Header( { setEntitiesSavedStatesCallback } ) {
	const {
		documentLabel,
		hasActiveMetaboxes,
		isPublishSidebarOpened,
		isSaving,
		showIconLabels,
	} = useSelect( ( select ) => {
		const currentPostType = select( 'core/editor' ).getCurrentPostType();
		const postType = select( 'core' ).getPostType( currentPostType );

		return {
			documentLabel:
				// Disable reason: Post type labels object is shaped like this.
				// eslint-disable-next-line camelcase
				postType?.labels?.singular_name ??
				// translators: Default label for the Document sidebar tab, not selected.
				__( 'Document' ),
			hasActiveMetaboxes: select( 'core/edit-post' ).hasMetaBoxes(),
			isPublishSidebarOpened: select(
				'core/edit-post'
			).isPublishSidebarOpened(),
			isSaving: select( 'core/edit-post' ).isSavingMetaBoxes(),
			showIconLabels: select( 'core/edit-post' ).isFeatureActive(
				'showIconLabels'
			),
		};
	}, [] );

	const { openModal } = useDispatch( 'core/edit-post' );

	const isLargeViewport = useViewportMatch( 'large' );

	return (
		<div className="edit-post-header">
			<MainDashboardButton.Slot>
				<FullscreenModeClose />
			</MainDashboardButton.Slot>
			<div className="edit-post-header__toolbar">
				<HeaderToolbar />
			</div>
			<div className="edit-post-header__settings">
				<Button
					label={ sprintf(
						/* translators: %s: singular document type. */
						__( '%s settings' ),
						documentLabel
					) }
					icon={ cog }
					isTertiary={ showIconLabels }
					showTooltip={ ! showIconLabels }
					onClick={ () => {
						openModal( 'edit-post/post-settings' );
					} }
				/>
				{ ! isPublishSidebarOpened && (
					// This button isn't completely hidden by the publish sidebar.
					// We can't hide the whole toolbar when the publish sidebar is open because
					// we want to prevent mounting/unmounting the PostPublishButtonOrToggle DOM node.
					// We track that DOM node to return focus to the PostPublishButtonOrToggle
					// when the publish sidebar has been closed.
					<PostSavedState
						forceIsDirty={ hasActiveMetaboxes }
						forceIsSaving={ isSaving }
						showIconLabels={ showIconLabels }
					/>
				) }
				<DevicePreview />
				<PostPreviewButton
					forceIsAutosaveable={ hasActiveMetaboxes }
					forcePreviewLink={ isSaving ? null : undefined }
				/>
				<PostPublishButtonOrToggle
					forceIsDirty={ hasActiveMetaboxes }
					forceIsSaving={ isSaving }
					setEntitiesSavedStatesCallback={
						setEntitiesSavedStatesCallback
					}
				/>
				{ ( isLargeViewport || ! showIconLabels ) && (
					<>
						<PinnedItems.Slot scope="core/edit-post" />
						<MoreMenu showIconLabels={ showIconLabels } />
					</>
				) }
				{ showIconLabels && ! isLargeViewport && (
					<MoreMenu showIconLabels={ showIconLabels } />
				) }
			</div>
		</div>
	);
}

export default Header;
