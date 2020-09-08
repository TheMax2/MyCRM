FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

FilePond.setOptions({
    stylePanelAspectRatio: 3/2,
    imageResizeTargetWidth: 150,
    imageResizeTargetHeight: 100,
})

FilePond.parse(document.body);