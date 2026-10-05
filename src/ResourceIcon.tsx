import type {Group} from './lib/inventory';

/** Compact game-inspired resource marks. They stay sharp on small mobile cards. */
export default function ResourceIcon({group}:{group:Group}){
 if(group==='skill')return <svg className="resource-icon resource-icon-skill" viewBox="0 0 64 64" aria-hidden="true"><path d="M10 19 45 8l3 6 7-2 5 31-7 2 1 7-35 7-2-7-7 2-6-30 7-2Z"/><path className="icon-detail" d="m32 22 3.3 7.3 8 2.7-7.1 4.1-.2 8.1-6.1-5.4-8 2.3 3.4-7.5-4.7-6.7 8.1.9Z"/><circle className="icon-detail" cx="15" cy="29" r="2"/><circle className="icon-detail" cx="49" cy="39" r="2"/></svg>;
 if(group==='egg')return <svg className="resource-icon resource-icon-egg" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 5C21 5 10 28 10 42c0 12 9 18 22 18s22-6 22-18C54 28 43 5 32 5Z"/><ellipse className="icon-spot" cx="25" cy="23" rx="5" ry="7"/><ellipse className="icon-spot" cx="41" cy="38" rx="7" ry="6"/><ellipse className="icon-spot" cx="23" cy="48" rx="4" ry="3"/></svg>;
 if(group==='mount')return <svg className="resource-icon resource-icon-mount" viewBox="0 0 64 64" aria-hidden="true"><g transform="rotate(-36 32 32)"><path d="M7 29h22v7H7Z"/><path d="M25 22c0-8 6-14 14-14s14 6 14 14-6 14-14 14H25Zm9 0c0 3 2 5 5 5s5-2 5-5-2-5-5-5-5 2-5 5Z"/><path d="M37 22c0-8 6-14 14-14s14 6 14 14-6 14-14 14H37Zm9 0c0 3 2 5 5 5s5-2 5-5-2-5-5-5-5 2-5 5Z"/></g></svg>;
 return <svg className="resource-icon resource-icon-potion" viewBox="0 0 64 64" aria-hidden="true"><path className="vial-cap" d="M22 6h24v10H22Z"/><path d="m24 15 21 5-8 35c-1 5-6 7-11 6l-5-1c-5-1-8-6-7-11l8-35Z"/><path className="icon-liquid" d="m19 38 20-5-4 19c-.7 3-3.5 5-7 4l-5-1c-3-.7-5-4-4-7Z"/><circle className="icon-bubble" cx="30" cy="44" r="2"/></svg>;
}
