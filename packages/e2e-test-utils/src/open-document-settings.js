/**
 * Clicks on the button in the header which opens the Document Settings dialog modal.
 */
export async function openDocumentSettings() {
	const documentSettingsModal = await page.$(
		'.edit-post-post-settings-modal'
	);

	// If document settings modal isn't already open, open it.
	if ( documentSettingsModal === null ) {
		const openButton = await Promise.race(
			page.$(
				'.edit-post-header__settings button[aria-label="Post settings"]'
			),
			page.$(
				'.edit-post-header__settings button[aria-label="Page settings"]'
			)
		);

		await openButton.click();
	}
}
