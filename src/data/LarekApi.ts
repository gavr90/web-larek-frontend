import { Api } from '../components/base/Api';
import {
	IItemData,
	ILarekApi,
	IOrderData,
	ISuccessData,
	ApiListResponse,
} from '../types';

export class LarekApi extends Api implements ILarekApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getItemsList(): Promise<IItemData[]> {
		return this.get('/product').then((data: ApiListResponse<IItemData>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	sendOrder(order: IOrderData): Promise<ISuccessData> {
		return this.post('/order', order).then((data: ISuccessData) => data);
	}
}
