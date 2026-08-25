import { Accessor, createSignal, onCleanup, onMount } from 'solid-js';

export interface UseFileDialogOptions {
  /** Determines whether multiple files are allowed, `true` by default */
  multiple?: boolean;

  /** `accept` attribute of the file input, `'*'` by default */
  accept?: string;

  /** `capture` attribute of the file input */
  capture?: string;

  /** Determines whether the user can pick a directory instead of file, `false` by default */
  directory?: boolean;

  /** Determines whether the file input state should be reset when the file dialog is opened, `false` by default */
  resetOnOpen?: boolean;

  /** Initial selected files */
  initialFiles?: FileList | File[];

  /** Called when files are selected */
  onChange?: (files: FileList | null) => void;

  /** Called when file dialog is canceled */
  onCancel?: () => void;
}

export interface UseFileDialogReturnValue {
  files: Accessor<FileList | null>;
  open: () => void;
  reset: () => void;
}

const defaultOptions: UseFileDialogOptions = {
  multiple: true,
  accept: '*',
};

function getInitialFilesList(files: UseFileDialogOptions['initialFiles']): FileList | null {
  if (!files) {
    return null;
  }

  if (typeof FileList !== 'undefined' && files instanceof FileList) {
    return files;
  }

  if (typeof DataTransfer === 'undefined') {
    return null;
  }

  const result = new DataTransfer();
  for (const file of files as File[]) {
    result.items.add(file);
  }

  return result.files;
}

function createInput(options: UseFileDialogOptions) {
  if (typeof document === 'undefined') {
    return null;
  }

  const input = document.createElement('input');
  input.type = 'file';

  if (options.accept) {
    input.accept = options.accept;
  }

  if (options.multiple) {
    input.multiple = options.multiple;
  }

  if (options.capture) {
    input.setAttribute('capture', options.capture);
  }

  if (options.directory) {
    (input as HTMLInputElement & { webkitdirectory?: boolean }).webkitdirectory =
      options.directory;
  }

  input.style.display = 'none';
  return input;
}

/**
 * Opens the native file picker dialog without rendering a visible `<input type="file" />`.
 */
export function useFileDialog(input: UseFileDialogOptions = {}): UseFileDialogReturnValue {
  const options: UseFileDialogOptions = { ...defaultOptions, ...input };
  const [files, setFiles] = createSignal<FileList | null>(
    getInitialFilesList(options.initialFiles),
  );

  let inputRef: HTMLInputElement | null = null;

  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target?.files) {
      setFiles(target.files);
      options.onChange?.(target.files);
    }
  };

  const createAndSetupInput = () => {
    inputRef?.remove();
    inputRef = createInput(options);

    if (inputRef) {
      inputRef.addEventListener('change', handleChange, { once: true });
      if (options.onCancel) {
        inputRef.addEventListener('cancel', options.onCancel, { once: true });
      }
      document.body.appendChild(inputRef);
    }
  };

  onMount(() => {
    createAndSetupInput();
    onCleanup(() => inputRef?.remove());
  });

  const reset = () => {
    setFiles(null);
    options.onChange?.(null);
  };

  const open = () => {
    if (options.resetOnOpen) {
      reset();
    }

    createAndSetupInput();
    inputRef?.click();
  };

  return { files, open, reset };
}

export namespace useFileDialog {
  export type Options = UseFileDialogOptions;
  export type ReturnValue = UseFileDialogReturnValue;
}
