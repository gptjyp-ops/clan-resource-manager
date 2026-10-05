import type {Group} from './lib/inventory';

/** Approved illustrated resource artwork from a transparent sprite. */
export default function ResourceIcon({group}:{group:Group}){
 return <span className={`resource-art resource-art-${group}`} aria-hidden="true" style={{backgroundImage:`url(${import.meta.env.BASE_URL}images/resource-icons-v2.webp)`}}/>;
}
