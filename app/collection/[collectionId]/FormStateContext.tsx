"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from "react";

export type Image = {
  id: string;
  url: string;
  width: number;
  height: number;
};

const FormStateContext = createContext<{
  images: Image[];
  busy: boolean;
  setImages: Dispatch<SetStateAction<Image[]>>;
  mutate: (func: () => Promise<unknown>) => void;
}>({
  images: [],
  busy: false,
  setImages: () => {},
  mutate: () => {},
});
export default FormStateContext;

export function FormStateProvider({
  children,
  initialImages,
}: {
  children: React.ReactNode;
  initialImages: Image[];
}) {
  const [images, setImages] = useState<Image[]>(initialImages);
  const [busy, setBusy] = useState(false);
  const mutate = useCallback((func: () => Promise<unknown>) => {
    setBusy(true);
    func().finally(() => setBusy(false));
  }, []);
  return (
    <FormStateContext.Provider
      value={{
        images,
        busy,
        setImages,
        mutate,
      }}
    >
      {children}
    </FormStateContext.Provider>
  );
}
