const TITLE_TEMPLATE = '%s | Bagon Hooks';

export default function getTitle(title: string = 'Home') {
  return TITLE_TEMPLATE.replace('%s', title);
}
