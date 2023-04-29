import { MultiSelect } from '../components/inputs/multi-select/multi-select.component';
import Number from '../components/inputs/number/number.component';
import { getFieldComponent } from './registry';

describe('registry', () => {
  it('should load the Number component with alias "numeric"', async () => {
    const result = await getFieldComponent('numeric');
    expect(result).toEqual({ default: Number });
  });

  it('should load the MultiSelect component with alias "multiCheckbox"', async () => {
    const result = await getFieldComponent('multiCheckbox');
    expect(result).toEqual({ default: MultiSelect });
  });

  it('should return undefined if no matching component is found', async () => {
    const result = await getFieldComponent('unknown');
    expect(result).toBeUndefined();
  });
});
