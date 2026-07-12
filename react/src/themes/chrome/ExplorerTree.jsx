import { useState } from 'react';
import { NAV_TREE } from '../../core/data';
import { Icon } from './Icons';
import { useLibrary, useQueue } from '../../core/hooks';
import { store } from '../../core/persist';

function activeIdFor(view) {
  if (view.startsWith('mix:')) return 'mixcds';
  if (view.startsWith('pl:')) return 'playlists';
  if (view.startsWith('album:')) return 'search';
  return view;
}

export function ExplorerTree({ view, onNav, onClose, open }) {
  const { likes, mixes } = useLibrary();
  const { queue } = useQueue();
  const [treeOpen, setTreeOpen] = useState(() => store.get('sp06_tree', { library: true }));
  const activeId = activeIdFor(view);

  function toggle(id) {
    const next = { ...treeOpen, [id]: treeOpen[id] === false ? true : false };
    setTreeOpen(next);
    store.set('sp06_tree', next);
  }

  function countFor(n) {
    if (n.id === 'mixcds') return mixes.length ? '(' + mixes.length + ')' : '';
    if (n.id === 'liked') return likes.length ? '(' + likes.length + ')' : '';
    if (n.id === 'queue') return queue.length ? '(' + queue.length + ')' : '';
    return '';
  }

  function renderNode(n, depth) {
    const open = treeOpen[n.id] !== false;
    const count = countFor(n);
    return (
      <div key={n.id}>
        <button className={'tree-row' + (activeId === n.id ? ' active' : '')}
          style={{ paddingLeft: 4 + depth * 15 }}
          onClick={() => onNav(n.id === 'library' ? 'songs' : n.id)}>
          {n.children ? (
            <span className="tree-tog" onClick={(e) => { e.stopPropagation(); toggle(n.id); }}>{open ? '−' : '+'}</span>
          ) : <span className="tree-tog empty"></span>}
          <Icon name={n.icon} />
          <span>{n.label}</span>
          {count && <span className="tree-count">{count}</span>}
        </button>
        {n.children && (
          <div className={'tree-children' + (open ? ' open' : '')}>
            <div className="tree-children-inner">
              {n.children.map((c) => renderNode(c, depth + 1))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className={'sidebar' + (open ? ' open' : '')}>
      <div className="side-caption">LIBRARY EXPLORER
        <button className="drawer-close" aria-label="Close menu" onClick={onClose}>&times;</button>
      </div>
      <div className="nav-tree">{NAV_TREE.map((n) => renderNode(n, 0))}</div>
      <div className="side-fill"></div>
    </aside>
  );
}
