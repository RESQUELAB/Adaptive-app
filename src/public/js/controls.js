
$('#changeEsp').click('click', () => {mc.mutate('language', 'es')})
$('#changeEng').click('click', () => {mc.mutate('language', 'en')})

$('#infoShow').click('click', () => {mc.mutate('information', 'show')})
$('#infoPartial').click('click', () => {mc.mutate('information', 'partial')})
$('#infoHide').click('click', () => {mc.mutate('information', 'hide')})

$('#changeLight').click(() => { mc.mutate('theme', 'light')})
$('#changeDark').click( () => { mc.mutate('theme', 'dark') })
$('#changeContrast').click( () => { mc.mutate('theme', 'contrast') })

$('#font_size_small').click(() => { mc.mutate('font', 'small')})
$('#font_size_default').click( () => { mc.mutate('font', 'default') })
$('#font_size_big').click( () => { mc.mutate('font', 'big') })


// Catalog controls
if (document.location.pathname.indexOf("catalog.html") >= 0) {
    $('#catalogControls').attr('style', 'display: grid;')
    
    $('#catalog_grid1cols').click( () => {
        controller.setGridSize(1)
    })
    $('#catalog_grid2cols').click( () => {
        controller.setGridSize(2)
    })
    $('#catalog_grid3cols').click( () => {
        controller.setGridSize(3)
    })
    $('#catalog_grid4cols').click( () => {
        controller.setGridSize(4)
    })
    $('#catalog_grid5cols').click( () => {
        controller.setGridSize(5)
    })
}