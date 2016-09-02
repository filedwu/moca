$(function() {
	// body...
	$('.del').on("click", function(e) {

		var target = $(e.target),
			id = target.data('id'),
			tr = $('.item-id-' + id);

		if (window.confirm('你确定要取消交易吗？')) {
			//alert("确定");
			// true;
			$.ajax({
					type: 'DELETE',
					url: '/admin/list?id=' + id
				})
				.done(function(re) {
					if (re.success === 1) {
						if (tr.length) {
							tr.remove()
						}
					}
				})
		} else {
			//alert("取消");
			return false;
		}
	})
})