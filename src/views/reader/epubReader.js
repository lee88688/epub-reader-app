import React, { useState, useRef, useEffect } from 'react';
import ePub from 'epubjs';
import Popover from '@material-ui/core/Popover';
import HighlightEditor, { getColorsValue } from './HighlightEditor';

export function useReader({ opfUrl }) {
  const rendition = useRef(null);
  const anchorEl = useRef(null);
  const [openPopover, setOpenPopover] = useState(false);
  const [curEditorValue, setCurEditorValue] = useState({ color: '', text: '', epubcfi: '' });
  const preEditorValue = useRef(curEditorValue);

  const updateHighlightElement = (value, temporarily = true) => {
    const { epubcfi } =value;
    const g = document.querySelector(`g[data-epubcfi="${epubcfi}"]`);
    Object.keys(g.dataset).forEach(k => { g.dataset[k] = value[k]; });
    g.setAttribute('fill', getColorsValue(value.color));
    if (!temporarily) {
      // change rendition's annotations
    }
  };

  useEffect(() => {
    // const viewer = document.querySelector('#viewer');
    // console.log(viewer.clientHeight);
    const book = ePub(opfUrl);
    rendition.current = book.renderTo('viewer', {
      manager: 'continuous',
      flow: 'paginated',
      width: '100%',
      height: '100%',
      snap: true
    });
    rendition.current.display(0);

    let epubcfi = '';
    rendition.current.on('selected', function(cfiRange, contents) {
      if (!epubcfi) {
        const fn = () => {
          contents.document.removeEventListener('mouseup', fn);
          const color ='red';
          const text = '';
          const cfi = epubcfi; // epubcfi will be set to null, save a copy.
          rendition.current.annotations.highlight(
            epubcfi,
            { color, text },
            e => {
              // new add highlight callback
              const g = document.querySelector(`g[data-epubcfi="${cfi}"]`);
              const editorValue = {};
              Object.keys(g.dataset).forEach(k => editorValue[k] = g.dataset[k]);
              setCurEditorValue(editorValue);
              anchorEl.current = e.target;
              setOpenPopover(true);
            },
            '',
            { fill: getColorsValue(color) }
          );
          // preEditorValue would be currently created values.
          preEditorValue.current = { color, text, epubcfi };
          setCurEditorValue({ color, text, epubcfi });
          epubcfi = null;
        };
        contents.document.addEventListener('mouseup', fn);
      }
      epubcfi = cfiRange;
    });
  }, [opfUrl]);

  useEffect(() => {
    if (openPopover && curEditorValue.epubcfi) {
      // find the highlight element and compare with the color before. if not the same, change element's color.
      updateHighlightElement(curEditorValue);
      // const g = document.querySelector(`g[data-epubcfi="${curEditorValue.epubcfi}"]`);
      // const preColor = g.dataset.color;
      // if (preColor !== curEditorValue.color) {
      //   g.dataset.color = curEditorValue.color;
      //   g.setAttribute('fill', getColorsValue(curEditorValue.color));
      // }
    }
  }, [curEditorValue.color]);

  const handleEditorChange = value => setCurEditorValue(value);

  const handleEditorCancel = () => {
    // canceling will remove changes
    updateHighlightElement(preEditorValue.current);
    setOpenPopover(false);
  };

  const handleConfirm = (value) => {
    updateHighlightElement(value, false);
    setOpenPopover(false);
  };

  const bookItem = (
    <React.Fragment>
      <div id="viewer" style={{ 'height': '100%', width: '100%' }}></div>
      <Popover
        open={openPopover}
        anchorEl={anchorEl.current}
        onClose={handleEditorCancel}
        anchorOrigin={{ vertical: 'bottom' }}
      >
        <HighlightEditor
          {...curEditorValue}
          onChange={handleEditorChange}
          onConfirm={handleConfirm}
          onCancel={handleEditorCancel}
        />
      </Popover>
    </React.Fragment>
  );

  return {
    bookItem,
    rendition,
    nextPage: () => rendition.current ? rendition.current.next() : null,
    prevPage: () => rendition.current ? rendition.current.prev() : null
  };
}
